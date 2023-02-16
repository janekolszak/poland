# Polish administartive division in one package

Polish administative division consists of:
* voivodships(województwa) that consist of 
* counties(powiaty) that consist of 
* municipalities(gminy).

This repository parses the official polish names from the official source (https://eteryt.stat.gov.pl/eTeryt/rejestr_teryt/udostepnianie_danych/baza_teryt/uzytkownicy_indywidualni/pobieranie/pliki_pelne.aspx) and saves in various formats.

# Generation
```
npm i
npm run generate
```

# Install

### Typescript
```
npm i @janekolszak/poland
```

### Golang
```
go get github.com/janekolszak/poland
```


# Legal definitions
jednostka osadnicza - wyodrębniony przestrzennie obszar zabudowy mieszkaniowej wraz z obiektami infrastruktury technicznej zamieszkany przez ludzi;
kolonia - jednostkę osadniczą powstałą jako rezultat ekspansji miejscowości poza obszar wcześniej istniejącej zabudowy, w szczególności: kolonię miasta, kolonię wsi;
miasto - jednostkę osadniczą o przewadze zwartej zabudowy i funkcjach nierolniczych posiadającą prawa miejskie bądź status miasta nadany w trybie określonym odrębnymi przepisami;
4)
miejscowość - jednostkę osadniczą lub inny obszar zabudowany odróżniające się od innych miejscowości odrębną nazwą, a przy jednakowej nazwie - odmiennym określeniem ich rodzaju;
5)
miejscowość niezamieszkana - miejscowość, w której nie przebywa stale lub nie jest zameldowana na pobyt stały co najmniej jedna osoba;
6)
miejscowość zamieszkana - miejscowość, w której stale przebywa lub jest zameldowana na pobyt stały co najmniej jedna osoba;
7)
obiekt fizjograficzny - wyodrębniony składnik środowiska geograficznego, w szczególności: nizinę, wyżynę, wzgórze, pasmo górskie, górę, szczyt góry, przełęcz, dolinę, kotlinę, jaskinię, rzekę, kanał, jezioro, zatokę, bagno, staw, sztuczny zbiornik wodny, wodospad, las, kompleks leśny, uroczysko, półwysep, wyspę;
8)
osada - niewielką jednostkę osadniczą na terenie wiejskim o odmiennym (wyróżniającym się) charakterze zabudowy albo zamieszkaną przez ludność związaną z określonym miejscem lub rodzajem pracy, w szczególności: osadę młyńską, osadę leśną, osadę rybacką, osadę kolejową, osadę po byłym państwowym gospodarstwie rolnym; osada może być samodzielna lub może stanowić część innej jednostki osadniczej;
9)
osiedle - zespół mieszkaniowy stanowiący integralną część miasta lub wsi;
10)
przysiółek - skupisko kilku gospodarstw położonych poza zabudową wsi stanowiące integralną część wsi;
11)
rodzaj miejscowości - określenie charakteru miejscowości ukształtowanej w procesie rozwoju osadnictwa, w szczególności: miasto, osiedle, wieś, osada, kolonia, przysiółek i ich części;
12)
wieś - jednostkę osadniczą o zwartej lub rozproszonej zabudowie i istniejących funkcjach rolniczych lub związanych z nimi usługowych lub turystycznych nieposiadającą praw miejskich lub statusu miasta.