import { setLang } from "../i18n";

export default function Map({ lang }: Props) {
	const { t } = setLang(lang);
	return (
		<section className="map">
			<div id="map">
				<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.4223123066895!2d139.73453691133497!3d35.69122392931061!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188d5cefc5d8f3%3A0x5cbdc7020997fb29!2z44OT44K444On44Oz44K744Oz44K_44O85biC44O26LC3!5e0!3m2!1sja!2sjp!4v1728888615463!5m2!1sja!2sjp" width="100%" height="450" style="border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
			</div>
			<div className="address-block">
				<h4>{t('Vision Center Ichigaya')}</h4>
				<ul className="address-list p-0 m-0">
					<li><i className="fa fa-home"></i><span>{t('4-8-21 Yamawaki Bldg. 3F, Kudan-Minami, Chiyodaku, Tokyo 102-0074')}</span></li>
				</ul>
				<a href="https://www.google.com/maps/dir//%E3%80%92102-0074+%E6%9D%B1%E4%BA%AC%E9%83%BD%E5%8D%83%E4%BB%A3%E7%94%B0%E5%8C%BA%E4%B9%9D%E6%AE%B5%E5%8D%97%EF%BC%94%E4%B8%81%E7%9B%AE%EF%BC%98%E2%88%92%EF%BC%92%EF%BC%91+%E5%B1%B1%E8%84%87%E3%83%93%E3%83%AB+2F,3F+%E3%83%93%E3%82%B8%E3%83%A7%E3%83%B3%E3%82%BB%E3%83%B3%E3%82%BF%E3%83%BC%E5%B8%82%E3%83%B6%E8%B0%B7/@35.6912239,139.7345369,17z/data=!4m17!1m7!3m6!1s0x60188d5cefc5d8f3:0x5cbdc7020997fb29!2z44OT44K444On44Oz44K744Oz44K_44O85biC44O26LC3!8m2!3d35.6912196!4d139.7371172!16s%2Fg%2F11kb4zmv9y!4m8!1m0!1m5!1m1!1s0x60188d5cefc5d8f3:0x5cbdc7020997fb29!2m2!1d139.7371172!2d35.6912196!3e3?hl=ja&entry=ttu&g_ep=EgoyMDI0MTAwOS4wIKXMDSoASAFQAw%3D%3D" target={'_blank'} className="btn btn-white-md">{t('Get Direction')}</a>
			</div>
		</section>
	);
}