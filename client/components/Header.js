import Head from 'next/head'
import stylesheet from '../styles/style.scss'

const Header = () => <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charSet="utf-8" />
    <link rel="stylesheet" type="text/css" href="/static/style.css"/>
    <style dangerouslySetInnerHTML={{ __html: stylesheet }}/>
</Head>;

export default Header;
