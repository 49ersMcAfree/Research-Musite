import React from 'react';
import swal from 'sweetalert';
import $ from 'jquery';
import saveAs from 'file-saver';
import JSZip from 'jszip';
import Element from '../../children/element/element';
import style from './output.module.css';
import Slider from 'react-bootstrap-slider';
import Select from 'react-select';
import MySelect from "./MySelect.js";
import _ from 'underscore';
//import './slider.module.css';
//定义blast的多项选择，当前版本没有使用
//const options = [
//  { label: 'Phosphoserine/Phosphothreonine (S,T)', value: "\"Phosphoserine_Phosphothreonine\"" },
//  { label: 'Phosphorylation (Y)', value: "\"Phosphotyrosine\"" },
//  { label: 'N-linked glycosylation (N)', value: "\"N-linked (GlcNAc) asparagine\""},
//  { label: 'O-linked glycosylation (S,T)', value: "\"O-linked (GlcNAc) serine_O-linked (GlcNAc) threonine\""},
//  { label: 'Ubiquitination (K)', value: "\"Glycyl lysine isopeptide (Lys-Gly)(interchain with G-Cter in ubiquitin)\"" },
//  { label: 'SUMOylation (K)', value:"\"Glycyl lysine isopeptide (Lys-Gly)(interchain with G-Cter in SUMO)\""},
//  { label: 'N6-acetyllysine (K)', value: "\"N6-acetyllysine\"" },
//  { label: 'Methyl-arginine (R)',value:"\"Omega-N-methylarginine_Dimethylated arginine_Symmetric dimethylarginine_Asymmetric dimethylarginine\""},
//  { label: 'Methyl-lysine (K)',value:"\"N6-methyllysine_N6,N6-dimethyllysine_N6,N6,N6-trimethyllysine\""},
//  { label: 'Pyrrolidone-carboxylic-acid (Q)', value: "\"Pyrrolidone carboxylic acid\""},
//  { label: 'S-palmitoyl cysteine (C)', value: "\"S-palmitoyl cysteine\""}
//
//];


const customselectStyles = {
  container: (provided) => ({
    ...provided,
    display: 'inline-block',
    width: '100%',
    minHeight: '1px',
    textAlign: 'left',
    border: 'none',
  }),
  control: (provided) => ({
    ...provided,
    border: '2px solid #757575',
    borderRadius: '0',
    minHeight: '1px',
    height: '28px',
  }),
  input: (provided) => ({
    ...provided,
    minHeight: '1px',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    minHeight: '1px',
    paddingTop: '0',
    paddingBottom: '0',
    color: '#757575',
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    minHeight: '1px',
  }),
  clearIndicator: (provided) => ({
    ...provided,
    minHeight: '1px',
  }),
  valueContainer: (provided) => ({
    ...provided,
    minHeight: '1px',
    height: '30px',
    paddingTop: '0',
    paddingBottom: '0',
  }),
  singleValue: (provided) => ({
    ...provided,
    minHeight: '1px',
    paddingTop: '0px',
    paddingBottom: '0px',
    color: '#grey'
  }),
};
const options = [
{ label: 'Phosphorylation (S,T)', value:"Phosphoserine_Phosphothreonine"},
{ label:'Phosphorylation (Y)', value:"Phosphotyrosine"},
{ label:'N-linked glycosylation (N)', value:"N-linked_glycosylation"},
{ label:'O-linked glycosylation (S,T)', value:"O-linked_glycosylation"},
{ label:'Ubiquitination (K)', value:"Ubiquitination"},
{ label:'SUMOylation (K)', value:"SUMOylation"},
{ label:'N6-acetyllysine (K)', value:"N6-acetyllysine"},
{ label:'Methylarginine (R)', value:"Methylarginine"},
{ label:'Methyllysine (K)', value:"Methyllysine"},
{ label:'Pyrrolidone carboxylic acid (Q)', value:"Pyrrolidone_carboxylic_acid"},
{ label:'S-Palmitoylation (C)', value:"S-palmitoyl_cysteine"},
{ label:'Hydroxyproline (P)',value:"Hydroxyproline"},
{ label:'Hydroxylysine (K)',value:"Hydroxylysine"},
];

const ptmshort ={
"Phosphoserine_Phosphothreonine":'P',
"Phosphotyrosine":'P',
"Phosphoserine":'P',
"Phosphothreonine":'P',
"N-linked_glycosylation":'gl',
"O-linked_glycosylation":'gl',
"Ubiquitination":'ub',
"SUMOylation":'su',
"N6-acetyllysine":'ac',
"Methylarginine":'me',
"Methyllysine":'me',
"Pyrrolidone_carboxylic_acid":'pc',
"S-palmitoyl_cysteine":'pa',
"Hydroxyproline":'Hy',
"Hydroxylysine":'Hy',
};

class Output extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      step: 0.01,
      min: 0,
      max: 1,
      curValue: 0.5, //default prediction score
      current: 1,
      currentshow:1,
      currentSeq: '',
      blastOptions: this.props.modelOptions,
      blastRes: [],
      blasting: false,
      blasted:false,
    }
  }

 // handle 3d table
 handle3Dbutton = (event) => {
    let seq = this.state.currentSeq.split("\n")[1];
    //console.log("current index "+this.state.current)
    let positions = Object.keys(this.props.results[this.state.current - 1]) //results的结构是： PTM1:score1|PTM2:score2|PTM3:score3 key 是position
    let position_selects=[];
    let score;
    let ptms;
    positions.forEach(pos=>{
        ptms = this.props.results[this.state.current-1][pos].split(";");
        //console.log(ptms);
        ptms.forEach(ptm=>{
            score = ptm.split(":")[1];
            if(Number(score)>Number(this.state.curValue))
            {
                //if(ptm.split(":")[0]=="Phosphoserine_Phosphothreonine")
                //{  if(seq[pos-1]=="S")
                //   {
                //   position_selects.push(pos+":Phosphoserine");
                //   }else{
                //   position_selects.push(pos+":Phosphothreonine");
                //   }
                //}else
                //{position_selects.push(pos+":"+ptm.split(":")[0])}
                position_selects.push(pos+":"+ptmshort[ptm.split(":")[0]]) //用short name to present in 3D
            }
        })        
    })
    let positions_select = position_selects.join("%2C");
    //console.log("current valid pos for 3D is "+positions_select)
    let show3dID = this.props.userId+new Date().toISOString();
    $.ajax({
     type:'post',
     url:'/save3ddata',
     data:{
         'show3dID':show3dID,
         'seq':seq,
         'positions_select':positions_select,
     },
     success: () => {
       //只有传数据成功才打开窗口，这样肯定有数据
       //let out = "http://www.musite.net:5000/3dtable?&show3dID="+show3dID;
       let out = 'http://www.musite.net/show3dtable/'+show3dID;
       window.open(out);
     },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
                      console.log(XMLHttpRequest.status);
                      console.log(XMLHttpRequest.readyState);
                      console.log(textStatus);
    }
    })
  }

    handleClickblasttitle = (e) => {
        window.open(e);
    }


  //在前端生成压缩包并下载
  //handleDownload = () => {
  //  let zip = new JSZip();
  //  //zip.file('input.fasta', this.props.originalInput); //如果用户上传很大的文件，前端未必可以接受，先不支持input的下载和保存。
  //  zip.file('output.txt', this.props.originalResults); //originalResults 这里是唯一需要的地方。
  //  zip.generateAsync({type: 'blob'}).then( content => {
  //    saveAs(content, `sequence.zip`);
  //  });
  //}
   
   
  //在前端生成压缩包并下载,为了减少一次web接收处理数据，不用originalResults，用this.props.results 与 this.props.title, 直接展示。用户profile的download也要改为这一种格式比较好。
  //    let positions = Object.keys(this.props.results[this.state.current - 1]) //results的结构是： PTM1:score1|PTM2:score2|PTM3:score3 key 是position
  //还需要this.props.input 获得position位置的amino acid
  handleDownload = () => {
    function compare(a, b){
            return a - b;
    }
    let zip = new JSZip();
    let score = this.state.curValue
    //zip.file('input.fasta', this.props.originalInput); //如果用户上传很大的文件，前端未必可以接受，先不支持input的下载和保存。
    //header
    let downloadoutput="ID\tPosition\tResidue\tPTMscores\tCutoff="+this.state.curValue+"\n";
    //console.log("Position\tResidue\tPTMscores\tCutoff="+this.state.curValue+"\n")
    for(let index=0;index<this.props.title.length;index++)
    {
        
        let positions = Object.keys(this.props.results[index]) //results的结构是： PTM1:score1|PTM2:score2|PTM3:score3 key 是position 这个position是从1 开始的不是0
        downloadoutput+=this.props.title[index]+"\n"
        positions.sort(compare).forEach(pos=>{
            let curresult = this.props.results[index][pos];//先用PTM1:score1|PTM2:score2|PTM3:score3 的形式，只有profile 的download与tool的download的结果不同，以后改为一样。
            //console.log(curresult);
            let temp = this.props.title[index].split(" ")[0].substr(1)+"\t"+pos.toString()+"\t"+this.props.input[index][pos-1].toString()+"\t"+curresult+"\t"
            let pastptm=[]
            curresult.split(";").forEach(ptm=>
            {
                if(Number(ptm.split(":")[1])>Number(score)) //不算等于的。
                {
                    pastptm.push(ptm)
                    //console.log(ptm)
                }
            })
            if(pastptm.length!=0){downloadoutput+=temp+pastptm.join("|")+"\n"}else{downloadoutput+=temp+"None\n"}
            //console.log(temp+pastptm.join("|")+"\n")
        }
        );
    }
    
    zip.file('Prediction_results.txt', downloadoutput);
    zip.generateAsync({type: 'blob'}).then( content => {
      saveAs(content, `MusiteDeepResult.zip`);
    });
  }
   
  //在前端生成压缩包并下载处理当前blast数据
  handleblastDownload = () => {
    let zip = new JSZip();
    let blastresult=this.state.currentSeq+"\n"; //第一个应该是query sequence
    this.state.blastRes.forEach(e => {
          //e.pos 不只是一个，这里要有一个循环。
          blastresult += e.printtitle+"\t";
          for(let pos of Object.keys(e.pos))
          {
          blastresult+=pos+":"+(e.pos[pos]).join(",")+";";
          //这个label不只是一个！+" positions:"+e.pos+"\n"+e.seq.join("")+"\n" 还要检查pos是从0开始，还是1！
          }
          blastresult+="\n"+e.seq.join("")+"\n";
    })
    
    //var blastJSON = JSON.stringify(this.state.blastRes);
    //console.log("blastresult:"+blastresult)
    zip.file('blastresult.txt', blastresult);
    zip.generateAsync({type: 'blob'}).then( content => {
    saveAs(content, `blastResult.zip`);
    });
  }
  
  
  handleSelect = blastOptions => {
  this.setState({blastOptions:blastOptions});
  }
  
  handleSelecttitle = titleindex => {
    //same with current nothing need to do
    //console.log(titleindex)
    if(this.state.current === titleindex['value']+1) return;
    this.setState({
      current: titleindex['value']+1,
      currentshow:titleindex['value']+1,
      blasted: false,
      blasting: false,
      blastOptions:this.props.modelOptions
    })
   }
  //调用blast
  handleBlast = () => {
    //console.log("userid in blast is "+this.props.userId);
  	let currentSeq = this.state.currentSeq;
    //console.log(this.state.currentSeq)
  	if(this.state.blasting === true){
      swal({
        text: "Please wait for blast processing!",
        icon: "info",
        button: "Got it!"//,
        //timer: 20000
      });
      return;
  	}
    
    if(this.state.blastOptions == null){
     swal({
      text: "Please select at least one PTM annotation!",
      icon: "info",
      button: "Got it!"//,
      //timer:20000
     })
     return;
    }
    if(this.state.blastOptions != null){
    this.setState({
    blasting: true
    })
    $.ajax(
      {
        type: 'post',
        url: '/blast',
        data: {
          'userId': this.props.userId,
          'seq': this.state.currentSeq, //this is single sequence can we do all input?
          'blastOptions': this.state.blastOptions
        },
        success: data =>{
        	if(currentSeq !== this.state.currentSeq) return;
          if(data){
          	//处理得到的blast结果，以便react在不同位置设置不同颜色
            //data 分为两个部分，一个是blast的比对结果，data[0] 另一个是 annotation的结果，data[1] 里。
            let res = data[0].split('\n');//don't consider the last
            res.shift();//remove the first query seq
            res = res.slice(0,res.length-1);//don't consider the last null 
            res = res.map(e => {
                if(e.split(' ').length>=3){
                //console.log(e)
            	let title = e.split(' ')[0].replace(/\s/g, "");//e.substring(0, 10).replace(/\s/g, "");//
            	let seq = e.split(' ')[2].split('');         //e.substring(18).split('');//
                let printtitle =title+"\t("+e.split(' ')[1]+")";
                //console.log(title)
                //console.log(seq)
              return {
              	'title': title, 
                'printtitle':printtitle,
              	'seq': seq,
              	'pos': {}, //这里要改，应该是一个{【】} 按pos的顺序，应该也是一个hash key是pos，里面有对于这个pos的【ptm1，ptm2，ptm3.。。。】 
              };
            }})
            res = res.slice(0, 50);// setlect top 50? 
            /* set position */
            let ptms = Object.keys(data[1]); //key 是ptm 值是 整个annotation 文本。
            let pos;
            let es;
            ptms.forEach(ptm=>{
                pos = data[1][ptm].split('\n'); //for single seq 
                pos.map(e => {
                    //console.log(ptm+" pos "+e);
                	es = e.split(' ');
                	let title = es[0];//seq id uniprot acc
                	if(es.length > 1){ //for this seq has annotated positions
                		es.splice(0, 1); //第一个是title 把它去掉。
                        //console.log("poses is "+es);
	                	for(let obj of res){//把position放到正确的地方。
	                		if(obj['title'] === title){
                                //console.log("yes!");
                                for(let e of es)
                                {
                                if(obj['pos'].hasOwnProperty(e))
                                {
	                			obj['pos'][e].push(ptm);// set 'pos' in res
                                //console.log("2 pos in obj "+ptm+" pos "+obj['pos'][e])
	                		    }else{
                                    obj['pos'][e]=[];
                                    obj['pos'][e].push(ptm);
                                    //console.log("1 pos in obj "+ptm+" pos "+obj['pos'][e])
                                }
                                }
                            }
	                	}           		
                	}
                })
            })
            this.setState({
            	blasting: false,
                blasted:  true,
              blastRes: res
            })
          }
        },
        error: (XMLHttpRequest, textStatus, errorThrown) => {
            this.setState({
        		blasting: false,
                blasted:  false
        	})
            
        	if(currentSeq !== this.state.currentSeq)
            {
            return;
            }
            swal({
          	title: "error",
          	text: "Please try again later!",
          	icon: "info",
          	button: "Got it!"//,
          	//timer: 20000
        	});
                  console.log(XMLHttpRequest.status);
                  console.log(XMLHttpRequest.readyState);
                  console.log(textStatus);
            
            }
      }
    )
    }    
  }

  //改变滑块值
  changeValue = () => {
    this.setState({
      curValue: this.sliderRef.getValue()
    });
  };

  //前翻页
  pageBack = () => {
    if(this.state.current === 1) return;
    this.setState({
      current: this.state.current - 1,
      currentshow:this.state.current - 1,
      blasted:false,
      blasting:false,
      blastOptions:this.props.modelOptions
    })
  }

  //后翻页
  pageForward = () => {
    if(this.state.current === this.props.input.length) return;
    this.setState({
      current: this.state.current + 1,
      currentshow:this.state.current + 1,
      blasted: false,
      blasting: false,
      blastOptions:this.props.modelOptions
    })
  }

  //输入页码
  changePage = e => {
    let pageNumber = Number(e.target.value);
    if(pageNumber===0)
    {
        pageNumber = "";
    }
    if(pageNumber <= this.props.input.length){
        this.setState({
        currentshow:pageNumber,
        })
    }
    //console.log("pageNumber is "+pageNumber)
    if(pageNumber >= 1 && pageNumber <= this.props.input.length){
      this.setState({
        current: pageNumber,
        blasted: false,
        blasting:false,
        blastOptions:this.props.modelOptions
      });      
    }

  };

    //为了在得到props 把状态设为初始
    componentWillReceiveProps = () =>{
     this.setState({
      blasted:false,
      blasting:false,
      //current:1,
      //currentshow:1,
     }) 
     }

  //判断是否需要更新组件，避免不必要的刷新以提高性能。
  shouldComponentUpdate(nextProps, nextState) {
    //不显示output时不刷新组件
    if(this.props.showOutput === false && nextProps.showOutput === false){
      return false;
    }
    //props和state没有变化时不刷新组件
    if(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState)){
       //这个false导致，如果正在blast，点同一个protein因为state没有改变，导致这个blast结果也要被显示出来。如果进入这个了，就直接return了，不会有下面的
      return false;
    }
    //reset page number to 1 when start a new job
    if(nextProps.title.length <= 0){
    	if(this.state.currentSeq !== ''){
    		this.setState({
    			currentSeq: ''
    		})
    	}
    	if(this.state.blasting !== false){
    		this.setState({
    			blasting: false,
                blasted: false
    		})
    	}
      this.setState({
        current: 1,
        currentshow:1,
        blasted:false,
        blasting:false,
        blastOptions:this.props.modelOptions
      })
    }
    //其他情况更新组件
    return true;
  }


  componentDidMount = () => {
    let current = this.state.current - 1;
    let title = this.props.title || [];
    //console.log(title)
    let seq = this.props.input || [];
    //console.log(seq)
    title = title[current] || '';
    seq = seq[current] || [];
    seq = seq.join('');
    seq = title + '\n' + seq;
    //console.log(seq)
    if(this.state.currentSeq !== seq){
      this.setState({
        currentSeq: seq
      })
    }
    //console.log(this.state.currentSeq)
   
  
  }
  
  componentWillUnmount () {
  }
  
  componentDidUpdate(){
    //if(this.props.userId !== prevProps.userId)
    //{
    //   this.fetchData(this.props.userId);
    //}
    let current = this.state.current - 1;
    let title = this.props.title || [];
    //console.log(title)
    let seq = this.props.input || [];
    //console.log(seq)
    title = title[current] || '';
    seq = seq[current] || [];
    seq = seq.join('');
    seq = title + '\n' + seq;
    //.log(seq)
    if(this.state.currentSeq !== seq){
      this.setState({
        currentSeq: seq
      })
    }
    
    //console.log(this.state.currentSeq)
    if(this.props.title.length === 0){
      this.setState({
        blastRes: []
      })
    }
  }

  render(){
    let input = this.props.input;
    let index = this.state.current - 1;
    let e = input[index] ||[]; //In case of the input hasn't been received
    let items;
    let blastRes = this.state.blastRes; //get blast results all results include query.
    //let curvalue = Number(this.props.currentresultstatus).toFixed(2);
    //console.log("currentresultstatus in output is "+this.props.currentresultstatus);
    //得到输出和loading时渲染不同的html
    //index2 是input序列e上的小循环 index是序列的大循环。 e 是一个序列。
    if(this.props.title.length > 0){
      items = (
          <div key = {index} className = {style.item}>
            <div>
                   <p className = {style.title}>{this.props.title[index]}</p>
                    
             </div>
            <div className = {this.state.blasted ? style.seqsblast:style.seqs}>
                    <div className = {style.ptmlabel}>
                       <label></label>
                       {e.map((e1, index1) => {
                         return <Element type = 'ptmlabel' value = {e1} id = {index1 + 1} curValue = {this.state.curValue} results = {this.props.results[index]} key = {'ptmlabel' + index1}/>
                       })}
                    </div>
                    <div className = {style.seq}>
                      <label>Sequence</label>
                      {e.map((e2, index2) =>{
                        return <Element type = 'seq' value = {e2} id = {index2 + 1} curValue = {this.state.curValue} results = {this.props.results[index]} key = {'seq' + index2}/>
                      })}
                    </div>
                    <div className = {style.seqpos}>
                      <label></label>
                      {e.map((e1, index1) => {
                        return <Element type = 'pos' value = {index1 + 1} key = {'pos' + index1}/>
                      })}
                    </div>
                    <div className = {style.seqpos}>
                      <label></label>
                      {e.map((e1, index1) => {
                        return <Element type = 'posvalue' value = {index1 + 1} key = {'posvalue' + index1}/>
                      })}
                    </div>
                    <div className = {this.state.blasted ? style.blast:style.hide}>
                      {blastRes.map((e3, index3) => {
                        let url = "https://www.uniprot.org/uniprot/"+e3['title'];
                        //console.log(url);
                        return (
                          <div className = {style.seq} key = {e3['title']}>
                          <a href = {url} target = "_blank">{e3['printtitle']}</a>
                          {e3['seq'].map((e4, index4) => {
                              return <Element type = 'blast' value = {e4} index = {index4 + 1} pos = {e3['pos']} key = {e3['title'] + index4}/>
                            })}
                          </div>
                        )
                      })}
                    </div>
			        <div className = {this.state.blasting ? style.blastLoading: style.hide}>
			          <div className = {style.loader}>
			            <div className = {style.dot}></div>
			            <div className = {style.dot}></div>
			            <div className = {style.dot}></div>       
			            <div className = {style.dot}></div>
			            <div className = {style.dot}></div>                   
			          </div>
			        </div>
            </div>
            <div className = {style.option}>
            <button className = {style.download} onClick = {this.handleDownload}>Save the prediction results to a file</button>
            </div>
            <div className = {this.state.blasted ? style.option:style.hide}>
            <button className = {style.download} onClick = {this.handleblastDownload}>Save the current blast result to a file</button>
            </div>
            
            <div className = {style.options}>
                <h3 style={{textAlign:"center"}}>Advanced functions</h3>
                <div className = {style.blastoptions}>
                    <div><button onClick = {this.handleBlast}>Blast-based annotation</button></div>
                    <div className = {style.select}>
                            <MySelect  isMulti 
                              options={options} 
                              closeMenuOnSelect={true} 
                              defaultValue = {this.props.modelOptions}
                              onChange = {this.handleSelect}
                              allowSelectAll={true}
                              value = {this.state.blastOptions}
                              maxMenuHeight={160}
                              />
                              <p>(adjust interested PTMs for BLAST)</p>
                    </div>
                    
                </div>
                <div><hr></hr></div>
                <div className = {style.option}>
                  <button onClick = {this.handle3Dbutton}>View predicted PTM sites in 3D structure</button>
                </div>
            </div>
            
          </div>
      )
    }


    else if(!this.state.blasting){
      items = (
        <div className = {style.loading}>
          <div className = {style.curvalue}>{this.props.currentresultstatus}%</div>
          <div className = {style.loader}>
            <div className = {style.dot}></div>
            <div className = {style.dot}></div>
            <div className = {style.dot}></div>
            <div className = {style.dot}></div>
            <div className = {style.dot}></div>
          </div>
        </div>
      )
    }

    return (
         
          <div className = {style.output}>
            <div className={style.outputid}>
              <p>Results for JobID: {this.props.outputjobId}</p>
            </div>
            <div className = {style.holder}>
               <div className = {style.slider}> 
                     <span className="font-weight-bold purple-text" style={{ marginLeft:"30px",marginRight: "5px" }}>{this.state.min}</span>
                     <Slider 
                       id="input-slider"
                       ref={e => {
                         if (e) this.sliderRef = e.mySlider;
                       }}
                       value={this.state.curValue}
                       slideStop={this.changeValue}
                       step={this.state.step}
                       min={this.state.min}
                       max={this.state.max}
                     />
                     <span className="font-weight-bold blue-text" style={{ marginLeft: "5px",marginRight:"30px" }}>{this.state.max}</span>
               </div>
                  
               <div className = {style.items}>
                {items}
               </div>
               <div className = {style.selectholder}>
                       <p style={{marginBottom:0}}>Search results by sequence name:</p>
                        <Select className = {style.select} 
                         options={this.props.titleindex} 
                         closeMenuOnSelect={true} 
                         onChange = {this.handleSelecttitle} 
                         defaultValue = {this.props.titleindex ? this.props.titleindex[index]:{'label':'...','value':0}}
                         value = {this.props.titleindex ? this.props.titleindex[index]:{'label':'...','value':0}}
                         styles={customselectStyles}
                         maxMenuHeight={140}
                         />
               </div>
               <div className = {style.page}>
                <span onClick = {this.pageBack}>&lt;</span>
                <span><input type = "number" value = {this.state.currentshow} min = "1" max = {this.props.input.length} onChange = {this.changePage}/> &nbsp; of &nbsp; {this.props.input.length}</span>
                <span onClick = {this.pageForward}>&gt;</span>
               </div>

             </div>
          </div>
    
    );
  }
}


export default Output
//            <button className = {style.title}>{this.props.title[index]}</button>

//<Select className = {style.select} options={options} isMulti closeMenuOnSelect={false} onChange = {this.handleSelect} />
//                      <label onClick=this.handleClickblasttitle(e3['title'])>{e3['printtitle']}</label>
//                    <a style={{display: "table-cell"}} href = {url} target = "_blank">{e3['printtitle']}</a>
//                    <td onClick={()=> window.open({url},"_blank")}>{e3['printtitle']}</td>
//                <span><input type = "number" value = {this.state.current > 0 ? this.state.current : ""} min = "1" max = {this.props.input.length} onChange = {this.changePage}/> &nbsp; of &nbsp; {this.props.input.length}</span>

//<Select className = {style.select} 
//                         options={this.props.titleindex} 
//                         closeMenuOnSelect={true} 
//                         onChange = {this.handleSelecttitle} 
//                         defaultValue = {this.props.titleindex ? this.props.titleindex[index]:{'label':'...','value':1}}
//                         value = {this.props.titleindex ? this.props.titleindex[index]:{'label':'...','value':1}}
//                         styles={{ singleValue: (base) => ({ ...base, color: '#grey'}), 
//                                   control: (base) => ({...base, minHeight: '1px', height: '32px',}),
//                                   valueContainer: (provided) => ({...provided,minHeight: '1px',height: '20px', paddingTop: '0',paddingBottom: '1rem',}),
//                         }}
//                         />

