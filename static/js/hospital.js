//time参数设置每次进行检查的时间间隔
//点击开启执行函数
function startHospital(state, hos_speed = 2000) {
	var interval = setInterval(function() {
		var count_hos = 0;
		if (state == false)
			clearInterval(interval);
		
		var hos_left_obj = document.getElementById("hospital_left");
		var die_num_obj = document.getElementById("hospital_die");
		var leftNum = parseInt(hos_left_obj.innerText);
		var dieNum = parseInt(die_num_obj.innerText);
		
		balls.forEach(function(value) { 	
			if(value.isInfect == true && value.isHos == false && 
			   value.isDie == false && count_hos < 5 && leftNum > 0) {
				count_hos++;
				value.isHos = true;
				leftNum--;
				hos_left_obj.innerText = leftNum;
				if(value.children[0] != undefined)
					value.children[0].style.backgroundColor = "transparent";
			}
			if(value.isDie == true && value.isHos == false && count_hos < 5) {
				count_hos++;
				value.isHos = true;
				value.style.backgroundColor = "transparent";
				if(value.children[0] != undefined)
					value.children[0].style.backgroundColor = "transparent";
				dieNum++;
				die_num_obj.innerText = dieNum;
			}
		})
	}, hos_speed)
}

function startCure(state, cure_speed = 2000){
	var interval = setInterval(function(){
		if(state == false)
			clearInterval(interval);
		var cure_obj = document.getElementById("hos_cure");
		var hos_left_obj = document.getElementById("hospital_left");
		var cure_num = parseInt(cure_obj.innerText);
		var leftNum = parseInt(hos_left_obj.innerText);

		balls.forEach(function(value){
			cure_factor = randomNum(0, 100);
			if(cure_factor > 0 && cure_factor <= 20 &&
			   value.isInfect == true && value.isHos == true && value.isDie == false){
				value.isInfect = false;
				value.isLatent = false;
				value.isHos = false;
				value.style.backgroundColor = '#2E2C2C';
				if(value.children[0] != undefined)
					value.children[0].style.backgroundColor = 'white';
				value.isCure = true;
				moveBalls(value);
				cure_num++;
				cure_obj.innerText = cure_num;
				leftNum++;
				hos_left_obj.innerText = leftNum;
			}
		})
	}, cure_speed)
}
