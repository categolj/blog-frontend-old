import React from "react";
import 'pivotal-ui/css/ellipsis';

export class Presentations extends React.Component {
    static content = [
        {
            name: 'PAS(Cloud Foundry)だと〇〇〇ができない...? 〜 Cloud Foundryにまつわる10つの誤解\n',
            href: 'https://docs.google.com/presentation/d/1_5px0UB0k7USS71xVnn6XgU1eArZ__Ee_eYmxkj-XcE',
            date: '2019-07-10',
            conference: 'Pivotal.IO 2019'
        },
        {
            name: 'Spring ❤️ Pivotal Cloud Foundry 〜 Spring BootのPlatform活用とYahoo! JAPANにおける事例紹介',
            href: 'https://docs.google.com/presentation/d/1-pXQP1dreyDme2ddhgnykwSBKcJyPP3SfcnhtujmrlQ',
            date: '2019-07-10',
            conference: 'Pivotal.IO 2019'
        },
        {
            name: 'Functional Spring Cookbook',
            href: 'https://docs.google.com/presentation/d/1-0NopTfA-CGiCNvKPDOH9ZDMHhazKuoT-_1R69Wp8qs',
            date: '2019-05-18',
            conference: 'JJUG CCC 2019 Spring'
        },
        {
            name: 'Serverless with Spring Cloud Function, Knative and riff',
            href: 'https://www.slideshare.net/makingx/serverless-with-spring-cloud-function-knative-and-riff-springonetour-s1t',
            date: '2018-11-06',
            conference: 'SpringOne Tour Tokyo'
        },
        {
            name: '決済システムの内製化への旅 - SpringとPCFで作るクラウドネイティブなシステム開発',
            href: 'https://www.slideshare.net/makingx/springpcf-jsug-sfh1',
            date: '2018-10-31',
            conference: 'Spring Fest 2018'
        },
        {
            name: 'Spring Boot Actuator 2.0 & Micrometer',
            href: 'https://www.slideshare.net/makingx/spring-boot-actuator-20-micrometer-jjugccc-ccca1',
            date: '2018-05-26',
            conference: 'JJUG CCC 2018 Spring'
        },
        {
            name: 'Open Service Broker APIとKubernetes Service Catalog',
            href: 'https://www.slideshare.net/makingx/open-service-broker-apikubernetes-service-catalog-k8sjp-90024385',
            date: '2018-03-08',
            conference: 'Kubernetes Meetup Tokyo #10'
        }
    ];

    render() {
        const list = Presentations.content.map(s =>
            <li key={s.name}><a href={s.href}>{s.name}</a> ({s.conference} / {s.date})</li>);
        return (<div>
            <h3 id="presentations" className={"home"}>Presentations</h3>
            <ul>
                {list}
            </ul>
        </div>);
    }

}
