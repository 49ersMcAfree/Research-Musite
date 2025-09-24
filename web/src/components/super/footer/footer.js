import React, { Component } from 'react';
import style from './footer.module.css';

class Footer extends React.Component{

	constructor(props){
		super(props);
		this.state = {
		}
	}
	render(){
		return (
			<div className = {style.wrapper}>
				<p>Please cite the following papers for using MusiteDeep: </p>
                <p> Wang, D., et al. (2020) MusiteDeep: a deep-learning based webserver for protein post-translational modification site prediction and visualization, Nucleic Acids Research,Volume 48, Issue W1, 02 July 2020, Pages W140–W146</p>
				<p> Wang, D., et al. (2019) Capsule network for protein post-translational modification site prediction, Bioinformatics, 35(14), 2386-2394.</p>
                <p> Wang, D., et al. (2017) MusiteDeep: a deep-learning framework for general and kinase-specific phosphorylation site prediction, Bioinformatics, 33(24), 3909-3916.</p>
			</div>
		)
	}
}


export default Footer
