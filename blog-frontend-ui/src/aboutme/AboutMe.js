import React from "react";
import 'pivotal-ui/css/ellipsis';
import {Panel} from "pivotal-ui/react/panels";
import {Image} from 'pivotal-ui/react/images';
import {Media} from 'pivotal-ui/react/media';

export class AboutMe extends React.Component {
    state = {
        content: []
    };

    async componentDidMount() {
    }

    render() {
        return (<Panel>
            <h2 id="abountme" className={"home"}>About Me</h2>
            <Media image={<Image src={'https://avatars2.githubusercontent.com/u/106908?s=200'}/>}>
                <h3>Name</h3>
                <p>Toshiaki Maki / 槙 俊明</p>
                <h3>Email</h3>
                <p>makingx@gmail.com</p>
            </Media>
            <Media>
                <h3>Work Experience</h3>
                <dl>
                    <dt>Apr 2020 - Present</dt>
                    <dd>Staff Solutions Architect at <a href={'https://www.vmware.com'}>VMware</a>, Tokyo</dd>
                    <dt>Sep 2018 - Apr 2020</dt>
                    <dd>Advisory Solutions Architect at <a href={'https://pivotal.io'}>Pivotal</a>, Tokyo</dd>
                    <dt>Jan 2016 - Aug 2018</dt>
                    <dd>Senior Solutions Architect at <a href={'https://pivotal.io'}>Pivotal</a>, Tokyo</dd>
                    <dt>Apr 2009 - Dec 2015</dt>
                    <dd><a href={'https://www.nttdata.com'}>NTTDATA</a>, Tokyo</dd>
                </dl>
                <h3>Education</h3>
                <dl>
                    <dt>Apr 2007 - Mar 2009</dt>
                    <dd>MS, Mechano-Informatics at <a href={'https://www.i.u-tokyo.ac.jp/'}>The University of Tokyo</a>
                    </dd>
                    <dt>Apr 2003 - Mar 2007</dt>
                    <dd>BS, Mechano-Informatics at <a href={'https://www.u-tokyo.ac.jp/'}>The University of Tokyo</a></dd>
                </dl>
            </Media>
        </Panel>);
    }
}
