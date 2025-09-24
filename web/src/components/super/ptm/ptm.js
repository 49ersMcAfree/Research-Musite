import React, { Component } from 'react';
import saveAs from 'file-saver';
import JSZip from 'jszip';
import $ from 'jquery';
import style from './ptm.module.css';
const fs = require( 'fs' );

const PTMdatamapping = {"Phosphoserine_Phosphothreonine.fasta": 'Phosphoserine/Phosphothreonine (S,T)',
                       "Phosphotyrosine.fasta":'Phosphorylation (Y)',
                       "N-linked (GlcNAc) asparagine.fasta":'N-linked glycosylation (N)',
                       "O-linked (GlcNAc) serine_O-linked (GlcNAc) threonine.fasta":'O-linked glycosylation (S,T)',
                       "Glycyl lysine isopeptide (Lys-Gly)(interchain with G-Cter in ubiquitin).fasta":'Ubiquitin (K)',
                       "N6-acetyllysine.fasta": 'N6-acetyllysine (K)',
                       "N6-methyllysine_N6,N6-dimethyllysine_N6,N6,N6-trimethyllysine.fasta": 'Methylation (K)',
                       "Omega-N-methylarginine_Dimethylated arginine_Symmetric dimethylarginine_Asymmetric dimethylarginine.fasta":'Methylation (R)',
                       "S-palmitoyl cysteine.fasta":'S-Palmitoylation (C)',
                       "Pyrrolidone carboxylic acid.fasta":'Pyrrolidone-carboxylic-acid (Q)',
                       "Glycyl lysine isopeptide (Lys-Gly)(interchain with G-Cter in SUMO).fasta":'SUMOylation (K)',
                       "3-hydroxyproline_4-hydroxyproline.fasta":'Hydroxyproline (P)',
                       "4,5-dihydroxylysine_3,4-dihydroxylysine_5-hydroxylysine.fasta":'Hydroxyproline (K)',
                       
                       };

//const PTMdatamapping = [
//'Phosphoserine/Phosphothreonine (S,T)':"\"Phosphoserine_Phosphothreonine\"" },
//'Phosphorylation (Y)':"\"Phosphotyrosine\"" },
//'N-linked glycosylation (N)': "\"N-linked (GlcNAc) asparagine\""},
//'Glycyl lysine isopeptide (Lys-Gly)(interchain with G-Cter in ubiquitin)': "\"Glycyl lysine isopeptide (Lys-Gly)(interchain with G-Cter in ubiquitin)\"" },
//'N6-acetyllysine (K)': "\"N6-acetyllysine\"" },
//'Methyl-arginine (R)':"\"Omega-N-methylarginine_Dimethylated arginine_Symmetric dimethylarginine_Asymmetric dimethylarginine\""},
//'S-Palmitoylation (C)': "\"S-palmitoyl cysteine\""},
//'Pyrrolidone-carboxylic-acid (Q)': "\"Pyrrolidone carboxylic acid\""},
//'SUMOylation (K)':"\"Glycyl lysine isopeptide (Lys-Gly)(interchain with G-Cter in SUMO)\""}
//];

const Record = (props) =>{
		return(
	    <div className = {style.item}>
          <div className={style.col1} title = {props.value[0]} onClick = {props.handleDownload}>{PTMdatamapping[props.value[0]]}</div>
          <div>{props.value[1]}</div>
          <div>{props.value[2]}</div>
	    </div>
	)
}


class Ptm extends React.Component{
	constructor(props){
		super(props);
		this.state = {
      ptm:[[]],
      updatetime:"",
      
      // not used the following just for debug
      //ptm: [
      //["Glycyllysineisopeptide(Lys-Gly)(interchainwithG-CterinSUMO)", 1288],
      //["N6,N6,N6-trimethyllysine", 1272],
      //["Phosphotyrosine.fasta", 9431],
      //["Phosphoserine_Phosphothreonine.fasta", 116553],
      //["S-palmitoylcysteine", 2236],
      //["N-linked (GlcNAc) asparagine.fasta", 109567],
      //["Phosphothreonine", 24212],
      //["Omega-N-methylarginine", 3124],
      //["Pyrrolidonecarboxylicacid", 1609],
      //["N6,N6-dimethyllysine", 985],
      //["N6-acetyllysine", 20994],
      //["N6-methyllysine", 1624]               
      //]
		}
	}
    getPTMdisplay = () => {
    //$.get('../static/ptm/display.txt', result => {
    $.get('../static/ptm/display.txt', result => {
     var textByLine = result.toString().split("\n");
     var ptmlist = [];
     var ptmprotein = [];
     var ptmsites =[];
     var i;
     var ptm_data=[];
     var updatetime = textByLine[0].split(" ")[1]+","+textByLine[0].split(" ")[4];
     for (i=1;i<textByLine.length;i++)
     {
         ptmlist[i]=textByLine[i].split("\t")[0];
         ptmprotein[i]=textByLine[i].split("\t")[1];
         ptmsites[i]=textByLine[i].split("\t")[2];
         ptm_data.push([ptmlist[i],ptmprotein[i],ptmsites[i]]);
         //console.log(ptmlist[i]);
         //console.log(ptmprotein[i]);
         //console.log(ptmsites[i]);
         //console.log(ptm_data);
     }
     
     this.setState({
        ptm: ptm_data,
        updatetime:updatetime,
      })
    });
  }
    
    handleDownload = e => {
      let title = e.target.title;
      $.ajax(
        {
          type: 'post',
          url: '/download',
          data: {
            'fileName': title,
            'fileType': 'ptm',
            'userId': 'common'
          },
          //在浏览器端生成压缩包并下载
          success: data =>{
            if(data){
              let zip = new JSZip();
              data.forEach(e => {
                zip.file(e.name, e.data);
              })
              zip.generateAsync({type: 'blob'}).then( content => {
                saveAs(content, `${PTMdatamapping[title]}.zip`);
              });
            }
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest.status);
                    console.log(XMLHttpRequest.readyState);
                    console.log(textStatus);
              }
        }
      )
    }
   
    //handleDownload = e => {
    //let title = e.target.title;
    //let zip = new JSZip();
    //zip.file('input.fasta', this.props.originalInput);
    //zip.generateAsync({type: 'blob'}).then( content => {
    //saveAs(content, `sequence.zip`);
    //});
    //}
    componentDidMount(){
    this.getPTMdisplay();
  }

	render(){
    let ptm = this.state.ptm;
		return (
  				<div>
  					<h2>Annotated sequences for download ({this.state.updatetime} release)</h2>
                  <div className = { style.content }>  
			      <div className = {style.record}>
                  <div className = {style.item}>
                  <div>  PTM types</div>
                  <div>number of proteins</div> 
                  <div>number of sites</div>
                  </div>
                  </div>
                    <div>
                    {ptm.map(e =>{
			          return(
			          	<div className = {style.record} key = {e}>
			          		<Record value = {e} handleDownload = {this.handleDownload} key = {'record'+e}/> 
			          	</div>
			          )
			        })}
                    </div>
			      </div>
                  <div>
                  <br />
                  <p>Clicking the PTM names to download the sequences (in the FASTA format).  Amino acids followed by "#" indicate the annotated sites</p>
                  </div>
			    </div>
		)
	}	
}


export default Ptm
