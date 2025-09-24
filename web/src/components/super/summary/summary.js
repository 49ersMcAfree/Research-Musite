import React, { Component } from 'react';
import style from './summary.module.css';
import img from './img/SCROLL-DOWN-button.gif'

const Summary = (props) => {
	return(
		<div className = {style.summary}>
		    <div className = {style.text}>
					<p style={{marginTop:'10px'}}>
					 MusiteDeep: a deep-learning framework for protein post-translational modification site prediction
                    </p>
			</div>
			<div className = {props.visitors > 0 ? style.visitors : style.visitorsHide}>
               <span className={style.flipit}>{props.visitors}</span>unique visitors </div>
            <div className = {props.num_protein > 0 ? style.num_protein : style.visitorsHide} >
               <span  className={style.flipit}>{props.num_protein}</span>processed proteins
            </div>
            <div className = {props.num_sites > 0 ? style.num_sites : style.visitorsHide} ><span className={style.flipit} >{props.num_sites}</span>processed amino acids</div>
		</div>
	)
}


export default Summary

/*
const Summary = (props) => {
	return(
		<div className = {style.summary}>
			<p className = {props.visitors > 0 ? style.visitors : style.visitorsHide}>{props.visitors} visitors has visited MusiteDeep</p>
            <p className = {props.num_protein > 0 ? style.num_protein : style.visitorsHide}>{props.num_protein} proteins have been processed</p>
            <p className = {props.num_sites > 0 ? style.num_sites : style.visitorsHide}>{props.num_sites} amino acids have been processed</p>
			<div className = {style.holder}>
				<div className = {style.text}>
					<p>
					MusiteDeep is a deep-learning framework which provides highly accurate prediction of protein post-translational modification sites solely from protein sequences.
                    </p>
                    <img className={style.center} src = {img} />
				</div>
			</div>
		</div>
	)
}


export default Summary*/