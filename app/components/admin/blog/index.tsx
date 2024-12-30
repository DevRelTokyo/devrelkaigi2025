import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams, useSearchParams } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import { ParseContext } from "~/contexts/parse";
import { setLang } from "~/utils/i18n";

export default function ProposalIndex() {
  const params = useParams();
	const [searchParams] = useSearchParams();
	const { Parse } = useContext(ParseContext)!;
  const { locale } = params;
	const [user, setUser] = useState<Parse.User | undefined>(undefined);
	const [articles, setArticles] = useState<Parse.Object[]>([]);
	// const schema = useSchema(locale!);
	const { t } = setLang(locale!);
	useEffect(() => {
		setUser(Parse.User.current());
	}, []);
	useEffect(() => {
		getArticles();
	}, [user]);

	const getArticles = async () => {
		if (!user) return;
		const query = new Parse.Query('Article');
		query.limit(parseInt(searchParams.get('limit') || '10'));
		query.skip(parseInt(searchParams.get('skip') || '0'));
		const articles = await query.find() as Parse.Object[];
		setArticles(articles);
	};

	return (
		user ? 
		<>
			<div className="container"
				style={{
					paddingTop: '150px',
					paddingBottom: '40px',
				}}
			>
				<div className="row">
					<div className="col-8 offset-2">
						<div className="row">
							<div className="col-8">
								<h2>{t('My profiles')}</h2>
							</div>
						</div>
					</div>
					<div className="col-8 offset-2">
						<table className="table table-striped">
							<thead>
								<tr>
									<th>{t('Language')}</th>
									<th>{t('Organization')}</th>
									<th>{t('Title')}</th>
									<th>{t('Name')}</th>
									<th>{t('Actions')}</th>
								</tr>
							</thead>
							<tbody>
								{articles.map((article, index) => (
									<tr key={index}>
										<td>
											{t(article.get('lang'))}
										</td>
										<td>
											{article.get('title')}
										</td>
										<td>{article.get('published_at')}</td>
										<td>
											<a href={`/${article.get('lang')}/admin/blog/${article.get('slug')}/edit`}>
												<FontAwesomeIcon icon={faPenToSquare} style={{width: 25, height: 25}} />
											</a>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>				
					
			</div>
		</>
		: 
		<>{t('Loading...')}</>
	);
}