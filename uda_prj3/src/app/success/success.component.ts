import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
  Fullname : String ="";
  Price : any;
  constructor(private router: Router, private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    if(navigation!=null){
      const state = navigation.extras.state as { fullName: string, price: any };
      if (state) {
        this.Fullname = state.fullName;
        this.Price = state.price;
      }
      console.log(state)
    }
  }

  ngOnInit(){
    
  
  }

}
