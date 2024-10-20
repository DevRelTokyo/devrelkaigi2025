import { setLang } from "../../i18n";
import FooterMain from "../footerMain";
import FooterSub from "../footerSub";
import Navi from "../../islands/navi";
import Subscribe from "../subscribe";
import { Parse } from '../../parse';
import markdownit from 'markdown-it';

type MemberShowProps = {
	lang: string;
	member: Parse.Object;
};

export default function Show({lang, member}: MemberShowProps) {
	const { t } = setLang(lang);
	
	const image = () => {
		const file = member.get('image_file');
		if (file) return file.url();
		if (member.get('image_url')) return member.get('image_url');
		return '/assets/images/icon/user.png';
	};

	const md = markdownit();
	const toMarkdown = (html: string) => {
		return md.render(html);
	};

	const icon = (url: string) => {
		if (url.includes('twitter')) return 'fa-brands fa-x-twitter';
		if (url.startsWith('https://x.com')) return 'fa-brands fa-x-twitter';
		if (url.includes('facebook')) return 'fa-brands fa-square-facebook';
		if (url.includes('linkedin')) return 'fa-brands fa-linkedin';
		if (url.includes('github')) return 'fa-brands fa-square-github';
		if (url.includes('instagram')) return 'fa-brands fa-square-instagram';
		return 'fa-solid fa-globe';
	};

	return (
		<>
			<section class="page-title bg-title">
				<div class="container">
					<div class="row">
						<div class="col-12 text-center">
							<ol class="breadcrumb justify-content-center pb-2 m-0">
								<li class="breadcrumb-item"><a href={`/${lang}`}>{t('Home')}</a></li>
								<li class="breadcrumb-item active">{member.get('name')}</li>
							</ol>
							<div class="title">
								<h3>
									{member.get('name')}
									{member.get('organization') ? `@${member.get('organization')}` : ''}
								</h3>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section class="section single-speaker">
				<div class="container">
					<div class="block">
						<div class="row">
							<div class="col-lg-5 col-md-6 align-self-md-center">
								<div class="image-block">
									<img src={image()} class="img-fluid" alt="speaker"
										width={500} height={500}
										style={{ objectFit: 'cover' }}
									/>
								</div>
							</div>
							<div class="col-lg-7 col-md-6 align-self-center">
								<div class="content-block">
									<div class="name">
										<h3>{member.get('name')}</h3>
									</div>
									<div class="profession">
										<p>{member.get('title')}</p>
									</div>
									<div class="details"
										dangerouslySetInnerHTML={{
											__html: toMarkdown(member.get('profile'))
										}}
									>
									</div>
									<div class="social-profiles">
										<h5>{t('Social Profiles')}</h5>
										<ul class="list-inline social-list">
											{member.get('socials').map((url: string) => (
												<li class="list-inline-item">
													<a href={url}><i class={icon(url)}></i></a>
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

		</>
	);
}