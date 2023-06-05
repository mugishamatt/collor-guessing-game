import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <!--The content below is only a placeholder and can be replaced.-->
    <div style="text-align:center" class="content">
  
    <h1>Hex Color Guessing Game</h1>

    <div>
      <button (click)="togleHistory()">History</button>
      <button (click)="clearHistory()">Reset Game</button>
    </div>
       <div *ngIf="!showHistory;else ngtemplate">
          <p>ScoreBoads:Wins:{{scoreBoard_state.WinsCount}} losses:{{scoreBoard_state.lossessCount}}</p>
      
          <div [ngStyle]="{'background-color':color_state.displayed,height:'100px',width:'200px'}" 
          [cheating]="color_state.displayed">{{color_state.displayed}}</div>
         
      <div>
        <button (click)="handleClick(color_state.color1)" #btns>{{color_state.color1}}</button>
        <button (click)="handleClick(color_state.color2)"#btns>{{color_state.color2}}</button>
        <button (click)="handleClick(color_state.color3)"#btns>{{color_state.color3}}</button>
      </div>
      <div #msg></div>
      <div #timer></div> 
       
      </div>
      </div>
     
      <ng-template #ngtemplate >
     
      <div *ngFor="let history of history_game_Obj;even as even " [ngStyle]="{'background-color':even ?'grey':'white'}" >{{history.displayed}} vs {{history.user_color}}=W:{{history.winCount}} L:{{history.lossesCount}} </div>
      </ng-template>
   
     
    
  `,
  styles: [`
  .content{


    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    
  }
  `]
})


export class AppComponent {
  title = 'hex-color-guessing-game';

  color_state={
    color1:'',
    color2:'',
    color3:'',
    displayed:''

  }
  scoreBoard_state={
    WinsCount:0,
    lossessCount:0
  }
@ViewChildren('btns') btns!:QueryList<ElementRef>
@ViewChild('msg') message!:ElementRef<HTMLDivElement>
@ViewChild('timer') timer!:ElementRef<HTMLDivElement>

showHistory:Boolean=false;

history_game_Obj:Array<{
  color1:string,
  color2:string,
  color3:string,
  displayed:string,
  user_color:string,
  winCount:number,
lossesCount:number
}> = []


togleHistory(){
  this.showHistory=!this.showHistory;
}

  ngOnInit(){
   this.resetColors()
   const data=localStorage.getItem('history')

 if(data!=null)
 {
  this.history_game_Obj=JSON.parse(data);
  const last= this.history_game_Obj.at(-1)
  this.scoreBoard_state={WinsCount:last?.winCount as number,lossessCount:last?.lossesCount as number}

 }else{
   console.log('no data')
 }
  }
  resetColors(){
    const colors=[
      this.generateRandomHexColor(),
      this.generateRandomHexColor(),
      this.generateRandomHexColor()
      ]
      const displayed=this.getRandomItemFromArray(colors)
      this.color_state={
     color1:colors[0],
     color2:colors[1],
     color3:colors[2],
    displayed:displayed
      }
  }

  handleClick(guess:string){
    if(guess===this.color_state.displayed){
      this.scoreBoard_state.WinsCount++;
      this.message.nativeElement.innerHTML="that is correct"

    }else{
      this.scoreBoard_state.lossessCount++
      this.message.nativeElement.innerHTML=`ouups wrong choicr: the correct color is:${this.color_state.displayed}`
    }

    this.history_game_Obj.push({
      color1: this.color_state.color1,
      color2: this.color_state.color2,
      color3: this.color_state.color3,
      displayed: this.color_state.displayed,
      user_color:guess,
      winCount:this.scoreBoard_state.WinsCount,
      lossesCount:this.scoreBoard_state.lossessCount
     })

   localStorage.setItem('history',JSON.stringify(this.history_game_Obj))

    this.btns.forEach((button:ElementRef<HTMLButtonElement>)=>{
      button.nativeElement.disabled=true;

    })

      let timer=3;
      const interval=setInterval(()=>{
       this.timer.nativeElement.innerHTML=`ressetting in ${--timer}`
       if (timer===0){
        this.timer.nativeElement.innerHTML=''
        this.message.nativeElement.innerHTML=''
        clearInterval(interval)
        this.btns.forEach((button:ElementRef<HTMLButtonElement>)=>{
          button.nativeElement.disabled=false;
          this.resetColors()
        })
      }
      },1000)
     
  }
clearHistory(){
  this.scoreBoard_state={WinsCount:0,lossessCount:0}
  this.history_game_Obj=[]
   this.showHistory=false;
}


//or
// historyObj: {
//   color1: string,
//   color2: string,
//   color3: string,
//   displayed: string
// }[] = [];
  

  private generateRandomHexColor(): string {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
  }
  
  private getRandomItemFromArray(arr: string[]): string {
    return arr[Math.floor(Math.random() * arr.length)];
  }

}
