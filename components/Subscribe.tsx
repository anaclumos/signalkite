import React from 'react'
import { Card, Cards, Callout } from 'nextra-theme-docs'

const Subscribe = () => {
  return (
    <form method="post" action="https://newsletters.cho.sh/subscription/form" id="subscribe-form">
      <Callout type="info" emoji="📧">
        <input type="email" name="email" required placeholder="E-mail" style={{
          borderRadius: '0.5rem',
          border: '0px',
          width: '100%',
          backgroundColor: 'transparent',
          margin: '0'
        }} />
      </Callout>
      <Cards>
        <Card icon="" title="български (bg)" href="javascript:document.getElementById('b883b').checked=true;document.getElementById('subscribe-form').submit();">
        </Card>
        <Card icon="" title="Čeština (cs)" href="javascript:document.getElementById('306f0').checked=true;document.getElementById('subscribe-form').submit();">
        </Card>
        <Card icon="" title="Dansk (da)" href="javascript:document.getElementById('b0348').checked=true;document.getElementById('subscribe-form').submit();" >
        </Card >
        <Card icon="" title="Deutsch (de)" href="javascript:document.getElementById('52954').checked=true;document.getElementById('subscribe-form').submit();" >
        </Card >
        <Card icon="" title="Ελληνικά (el)" href="javascript:document.getElementById('f6b4d').checked=document.getElementById('subscribe-form').true;submit();" >
        </Card >
        <Card icon="" title="English (en)" href="javascript:document.getElementById('4ecc0').checked=true;document.getElementById('subscribe-form').submit();" >
        </Card >
        <Card icon="" title="Espanya (es)" href="javascript:document.getElementById('5f59e').checked=true;document.getElementById('subscribe-form').submit();" >
        </Card >
        <Card icon="" title="Eesti (et)" href="javascript:document.getElementById('1d76a').checked=true;document.getElementById('subscribe-form').submit();" >
        </Card >
        <Card icon="" title="Suomi (fi)" href="javascript:document.getElementById('d473a').checked=document.getElementById('subscribe-form').true;submit();" >
        </Card >
        <Card icon="" title="Français (fr)" href="javascript:document.getElementById('d5c07').checked=document.getElementById('subscribe-form').true;submit();" >
        </Card >
        <Card icon="" title="Magyar (hu)" href="javascript:document.getElementById('d0a87').checked=document.getElementById('subscribe-form').true;submit();" >
        </Card >
        <Card icon="" title="Bahasa Indonesia (id)" href="javascript:document.getElementById('65116').checked=true;document.getElementById('subscribe-form').submit();" >
        </Card >
        <Card icon="" title="Italiano (it)" href="javascript:document.getElementById('b2c1f').checked=document.getElementById('subscribe-form').true;submit();" >
        </Card >
        <Card icon="" title="日本語 (ja)" href="javascript:document.getElementById('f3087').checked=document.getElementById('subscribe-form').true;submit();" >
        </Card >
        <Card icon="" title="한국어 (ko)" href="javascript:document.getElementById('61d50').checked=true;document.getElementById('subscribe-form').submit();" >
        </Card >
        <Card icon="" title="Lietuvių (lt)" href="javascript:document.getElementById('81b93').checked=true;document.getElementById('subscribe-form').submit();" >
        </Card >
        <Card icon="" title="Latviešu (lv)" href="javascript:document.getElementById('fc7b0').checked=document.getElementById('subscribe-form').true;submit();" >
        </Card >
        <Card icon="" title="Nederlands (nl)" href="javascript:document.getElementById('b0ab7').checked=document.getElementById('subscribe-form').true;submit();" >
        </Card >
        <Card icon="" title="Norge (no)" href="javascript:document.getElementById('e8dd3').checked=document.getElementById('subscribe-form').true;submit();" >
        </Card >
        <Card icon="" title="Polski (pl)" href="javascript:document.getElementById('4332f').checked=true;document.getElementById('subscribe-form').submit();" >
        </Card >
        <Card icon="" title="Português (pt)" href="javascript:document.getElementById('ff5bd').checked=document.getElementById('subscribe-form').true;submit();" >
        </Card >
        <Card icon="" title="Română (ro)" href="javascript:document.getElementById('bdb1a').checked=document.getElementById('subscribe-form').true;submit();" >
        </Card >
        <Card icon="" title="Русский (ru)" href="javascript:document.getElementById('43559').checked=true;document.getElementById('subscribe-form').submit();" >
        </Card >
        <Card icon="" title="Slovenčina (sk)" href="javascript:document.getElementById('be766').checked=document.getElementById('subscribe-form').true;submit();" >
        </Card >
        <Card icon="" title="Slovenščina (sl)" href="javascript:document.getElementById('3d77b').checked=true;document.getElementById('subscribe-form').submit();" >
        </Card >
        <Card icon="" title="Svenska (sv)" href="javascript:document.getElementById('55c70').checked=true;document.getElementById('subscribe-form').submit();" >
        </Card >
        <Card icon="" title="Türkçe (tr)" href="javascript:document.getElementById('2120b').checked=true;document.getElementById('subscribe-form').submit();" >
        </Card >
        <Card icon="" title="Українська (uk)" href="javascript:document.getElementById('1a923').checked=true;document.getElementById('subscribe-form').submit();" >
        </Card >
        <Card icon="" title="中文 (zh)" href="javascript:document.getElementById('61502').checked=true;document.getElementById('subscribe-form').submit();" >
        </Card >
      </Cards>
      <div style={{ display: 'none' }}>
        <input id="b883b" type="checkbox" name="l" value="b883b09e-f87f-49d7-90a5-12e3cf35ba88" />
        <label htmlFor="b883b">български (bg)</label>
        <input id="306f0" type="checkbox" name="l" value="306f0b81-393a-44ac-a5c3-ecbb0e9418be" />
        <label htmlFor="306f0">Čeština (cs)</label>
        <input id="b0348" type="checkbox" name="l" value="b034802b-cedc-480e-8eed-987a4d8d1da2" />
        <label htmlFor="b0348">Dansk (da)</label>
        <input id="52954" type="checkbox" name="l" value="52954b4c-618f-47a1-aede-db215fe34224" />
        <label htmlFor="52954">Deutsch (de)</label>
        <input id="f6b4d" type="checkbox" name="l" value="f6b4d6f2-5153-44dd-9218-eabba3d11b6c" />
        <label htmlFor="f6b4d">Ελληνικά (el)</label>
        <input id="4ecc0" type="checkbox" name="l" value="4ecc0fef-6f96-40ca-8fb5-6d13a2a836fc" />
        <label htmlFor="4ecc0">English (en)</label>
        <input id="5f59e" type="checkbox" name="l" value="5f59ec4d-f60d-47f8-b696-35454037a700" />
        <label htmlFor="5f59e">Espanya (es)</label>
        <input id="1d76a" type="checkbox" name="l" value="1d76af3c-7ea0-4731-82f2-16bcc7a6e73e" />
        <label htmlFor="1d76a">Eesti (et)</label>
        <input id="d473a" type="checkbox" name="l" value="d473a1b5-8d98-4e99-b0e6-798893f07e72" />
        <label htmlFor="d473a">Suomi (fi)</label>
        <input id="d5c07" type="checkbox" name="l" value="d5c075a9-5857-4def-bf87-574571c41ddf" />
        <label htmlFor="d5c07">Français (fr)</label>
        <input id="d0a87" type="checkbox" name="l" value="d0a873f8-e26a-4fb2-8c2f-4a6a7da231b7" />
        <label htmlFor="d0a87">Magyar (hu)</label>
        <input id="65116" type="checkbox" name="l" value="65116af5-a8f8-4a48-9e84-5743818c1138" />
        <label htmlFor="65116">Bahasa Indonesia (id)</label>
        <input id="b2c1f" type="checkbox" name="l" value="b2c1f107-f278-4fe9-b311-6b0f16ada56a" />
        <label htmlFor="b2c1f">Italiano (it)</label>
        <input id="f3087" type="checkbox" name="l" value="f3087ae3-fc01-4bf0-8ddb-b837991d815d" />
        <label htmlFor="f3087">日本語 (ja)</label>
        <input id="61d50" type="checkbox" name="l" value="61d50954-def8-4e11-8c7d-619e3ad61750" />
        <label htmlFor="61d50">한국어 (ko)</label>
        <input id="81b93" type="checkbox" name="l" value="81b93cc7-8d0a-4c97-9e92-0cc10d05080e" />
        <label htmlFor="81b93">Lietuvių (lt)</label>
        <input id="fc7b0" type="checkbox" name="l" value="fc7b0d46-24be-48fd-9cac-e9103d2b0a13" />
        <label htmlFor="fc7b0">Latviešu (lv)</label>
        <input id="b0ab7" type="checkbox" name="l" value="b0ab7199-158a-409b-b5ea-fe8442a9bb6c" />
        <label htmlFor="b0ab7">Nederlands (nl)</label>
        <input id="e8dd3" type="checkbox" name="l" value="e8dd3929-646d-41f9-999e-c1f24a5e2950" />
        <label htmlFor="e8dd3">Norge (no)</label>
        <input id="4332f" type="checkbox" name="l" value="4332f47d-0ebb-405c-82c8-9ee7ca3288f9" />
        <label htmlFor="4332f">Polski (pl)</label>
        <input id="ff5bd" type="checkbox" name="l" value="ff5bd42d-2202-4dc1-9d56-f331ea3de4f1" />
        <label htmlFor="ff5bd">Português (pt)</label>
        <input id="bdb1a" type="checkbox" name="l" value="bdb1af01-4117-4647-a45c-016dc6e8d231" />
        <label htmlFor="bdb1a">Română (ro)</label>
        <input id="43559" type="checkbox" name="l" value="43559490-cc7e-4931-b456-974f27737f27" />
        <label htmlFor="43559">Русский (ru)</label>
        <input id="be766" type="checkbox" name="l" value="be76696b-119f-468a-b5ce-861c7c60f244" />
        <label htmlFor="be766">Slovenčina (sk)</label>
        <input id="3d77b" type="checkbox" name="l" value="3d77b1b6-9204-435f-8855-f60a7943c69c" />
        <label htmlFor="3d77b">Slovenščina (sl)</label>
        <input id="55c70" type="checkbox" name="l" value="55c70ef2-a0b9-4689-9331-66e9b2166813" />
        <label htmlFor="55c70">Svenska (sv)</label>
        <input id="2120b" type="checkbox" name="l" value="2120be4a-dc37-4520-992a-ad78e1017a8c" />
        <label htmlFor="2120b">Türkçe (tr)</label>
        <input id="1a923" type="checkbox" name="l" value="1a9237b8-2ada-43d7-8b7d-da9d54530212" />
        <label htmlFor="1a923">Українська (uk)</label>
        <input id="61502" type="checkbox" name="l" value="6150256a-eced-4e91-adf8-4504c176e673" />
        <label htmlFor="61502">中文 (zh)</label>
      </div>
    </form >
  )
}

export default Subscribe
