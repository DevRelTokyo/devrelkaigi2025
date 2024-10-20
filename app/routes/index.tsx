import About from '../components/about';
import Banner from '../components/banner';
import Cta from '../components/cta';
import FooterMain from '../components/footerMain';
import FooterSub from '../components/footerSub';
import Navi from '../islands/navi';
import News from '../components/news';
import MapView from '../components/map';
import PriceTable from '../components/priceTable';
import Registration from '../components/registration';
import Schedule from '../components/schedule';
import Speakers from '../components/speakers';
import Sponsors from '../components/sponsors';
import Subscribe from '../components/subscribe';
import Price from '../components/price';

export default function Index({lang, articles}: Props) {
   console.log(import.meta.env);
	return (
		<>
         <Navi lang={lang} />
         <Banner lang={lang}	/>
         <About lang={lang} />
         <Speakers lang={lang} />
         <Schedule lang={lang}	/>
         <Price lang={lang}	/>
         <Sponsors lang={lang} />
         <News
            lang={lang}
            articles={articles}
         />
         <Subscribe lang={lang} />
         <MapView lang={lang} />
         <FooterMain lang={lang} />
         <FooterSub lang={lang} />
		</>
	);
}