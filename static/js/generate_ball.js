//生成随机数
function randomNum(m, n) {
	return Math.floor(Math.random() * (n - m + 1) + m);
}

//获得wrapDiv
var wrapDiv = document.getElementById("wrap");
//定义数组存储所有的小球
var balls = [];

//生成小球函数
function createBalls(num, isInfect = false, isLatent = false, peopleSpeed) {
	//i是创造小球的数目
	for (var i = 0; i < num; i++) {
		var ball = document.createElement("p");
		if(isMask == true)
			ball.innerHTML = "<h1></h1>";
		//随机小球起始的X坐标和小球的Y坐标
		ball.x = randomNum(0, 813);
		ball.y = randomNum(0, 800);
		//随机小球的移动速度
		ball.speed = randomNum(1, peopleSpeed);
		ball.isInfect = isInfect; //是否被感染并且发病
		ball.isLatent = isLatent; //是否正在潜伏期
		ball.latentDay = randomNum(0, 14); //存储在已潜伏的时间0到14天之间
		ball.isDie = false; //是否死亡
		ball.isImm = false; //是否有抗体
		ball.isHos = false; //是否在医院
		ball.isCure = false;
		ball.isInfectbefore = false;
		//随机小球移动的方向
		if (Math.random() - 0.5 > 0) {
			ball.xflag = true;
		} else {
			ball.xflag = false;
		}
		if (Math.random() - 0.5 > 0) {
			ball.yflag = true;
		} else {
			ball.yflag = false;
		}
		//随机小球的背景颜色

		if (ball.isInfect == true) {
			ball.style.backgroundColor = "#DC143C";
			ball.isInfectbefore = true;
		} else if (ball.isLatent == true) {
			ball.style.backgroundColor = "#4169E1";
		} else
			ball.style.backgroundColor = "#2E2C2C";

		//将小球插入当wrapDiv中
		wrapDiv.appendChild(ball);
		//将所有的小球存储到数组中
		balls.push(ball);
		moveBalls(ball);
	}
}

var count_infect = new Array();
var count_die = new Array();
var count_latent = new Array();
var ac_infect = new Array();//累计数组的数据
var ac_die = new Array();
var ac_latent = new Array();
var count_test = 0;
var die_num = 0;
var infect_num = 0;
var count_infect_before = 0;

function testEnding(balls) {
	var interval = setInterval(function() {

		var flag_end = true;


		count_infect[count_test] = 0;
		count_latent[count_test] = 0;
		count_die[count_test] = 0;
		ac_infect[count_test] = 0;
		ac_die[count_test] = 0;
		ac_latent[count_test] = 0;


		balls.forEach(function(value) {

			if(value.isInfect == true && value.isDie == false) {
				ac_infect[count_test]++;
				flag_end = false;
			}

			if(value.isDie == true)
				ac_die[count_test]++;


			if(value.isLatent == true && value.isDie == false) {
				ac_latent[count_test]++;
				flag_end = false;
			}


			if(value.isInfect == true && value.isHos == false && value.isDie == false) {
				count_infect[count_test]++;
			}
			if(value.isLatent == true && value.isHos == false && value.isDie == false) {
				count_latent[count_test]++;
			}
			if (value.isDie == true && value.isHos == false) {
				count_die[count_test]++;
				flag_end = false;
			}

		});

		count_test++;
		
		if(flag_end == true) {
			balls.forEach(function (value, index) {
				if(value.isDie == true)
					die_num++;
				if(value.isInfect == true)
					infect_num++;
				if(value.isInfectBefore == true)
					count_infect_before++;

			});
			var ball_arr = {
				info:{
					mask:isMask,
					hos:hos_state,
					hosSpeed:hos_speed,
					cluster:cluster_factor,
					infectNum:infectNum,
					peopleNum:peopleNum,
					peopleSpeed:peopleSpeed,
					hoscap:hoscap,
				},

				dieNum:die_num,
				count_infect:count_infect,
				count_die:count_die,
				count_latent:count_latent,
				ac_die:ac_die,
				ac_latent:ac_latent,
				ac_infect:ac_infect,
				infect_num:infect_num,
				count_infect_before:count_infect_before
			};

			var data = JSON.stringify(ball_arr)

			alert("模拟结束!");

			//传递参数给后台：
			$.ajax({
				url:'/',
				data:data,
				type:'post',
				traditional:true,
				dataType:'json',
				success:function(data){
					if(data.msg == "success"){
						window.open("http://127.0.0.1:5000/file/","_blank");
						window.location.reload();
					}
				},
				error:function(error){
					alert("下载错误，请重试。");
					window.location.reload();
				}
			})

			clearInterval(interval);

		}
	}, 100)
}


//小球移动函数，判断小球的位置
function moveBalls(ballObj) {
	var interval = setInterval(function() {
	
		//如果死亡则将颜色透明，中止移动和碰撞函数
		if (ballObj.isHos == true) {
			ballObj.style.backgroundColor = "transparent";
			clearInterval(interval);
		}
		if (ballObj.isDie == true && ballObj.isHos == false) {
			clearInterval(interval);
		}
		ballObj.style.top = ballObj.y + "px";
		ballObj.style.left = ballObj.x + "px";
		//判断小球的标志量，对小球作出相应操作
		if (ballObj.yflag) {
			//小球向下移动
			ballObj.y += ballObj.speed;
			if (ballObj.y >= 830 - ballObj.offsetWidth) {
				ballObj.y = 830 - ballObj.offsetWidth;
				ballObj.yflag = false;
			}
		} else {
			//小球向上移动
			ballObj.y -= ballObj.speed;
			if (ballObj.y <= 0) {
				ballObj.y = 0;
				ballObj.yflag = true;
			}
		}
		if (ballObj.xflag) {
			//小球向右移动
			ballObj.x += ballObj.speed;
			if (ballObj.x >= 813 - ballObj.offsetHeight) {
				ballObj.x = 813 - ballObj.offsetHeight;
				ballObj.xflag = false;
			}
		} else {
			//小球向左移动
			ballObj.x -= ballObj.speed;
			if (ballObj.x <= 0) {
				ballObj.x = 0;
				ballObj.xflag = true;
			}
		}

		if (ballObj.isLatent == true && ballObj.isInfect == false && ballObj.isHos == false) {
			//设置潜伏日期
			if (ballObj.latentDay <= 14) {
				ballObj.latentDay += 1;
			} else {
				ballObj.style.backgroundColor = "#DC143C";
				ballObj.isInfect = true;
				ballObj.isInfectBefore = true;
			}
		}

		if (ballObj.isInfect == true && ballObj.isDie == false && ballObj.isHos == false) {
			die_factor = randomNum(0, 1000);
			if (die_factor >= 999) {
				ballObj.style.backgroundColor = "#808000";
				ballObj.isDie = true;
			}
			if (die_factor > 0 && die_factor < 3) {
				ballObj.style.backgroundColor = "#FFD700"
				ballObj.isImm = true;
				ballObj.isInfect = false;
				ballObj.isLatent = false;
			}
		}
			crash(ballObj);
	}, 10);
}

var x1, y1, x2, y2;
var ori_count = 0; //控制方向的参数

//碰撞函数
function crash(ballObj) {
		//通过传过来的小球对象来获取小球的X坐标和Y坐标
		x1 = ballObj.x;
		y1 = ballObj.y;
		for (var i = 0; i < balls.length; i++) {
			//确保不和自己对比
			if (ballObj != balls[i] && ballObj.isHos == false && balls[i].isHos == false) {
				x2 = balls[i].x;
				y2 = balls[i].y;
				//判断位置的平方和小球的圆心坐标的关系
				if (Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + 60 <= Math.pow(ballObj.offsetWidth + balls[i].offsetWidth, 2)) {
					var orientation = true;
					ori_count++;
					if(ori_count % cluster_factor == 0)
						orientation = false;
					else
						orientation = true;
					//判断传过来的小球对象，相对于碰撞小球的哪个方位
					if (ballObj.x < balls[i].x) {
						if (ballObj.y < balls[i].y) {
							//小球对象在被碰小球的左上角
							ballObj.yflag = !orientation;
							ballObj.xflag = !orientation;
						} else if (ballObj.y > balls[i].y) {
							//小球对象在被碰小球的左下角
							ballObj.xflag = !orientation;
							ballObj.yflag = orientation;
						} else {
							//小球对象在被撞小球的正左方
							ballObj.xflag = !orientation;
						}
					} else if (ballObj.x > balls[i].x) {
						if (ballObj.y < balls[i].y) {
							//小球对象在被碰撞小球的右上方
							ballObj.yflag = !orientation;
							ballObj.xflag = orientation;
						} else if (ballObj.y > balls[i].y) {
							//小球对象在被碰撞小球的右下方
							ballObj.xflag = orientation;
							ballObj.yflag = orientation;
						} else {
							//小球对象在被撞小球的正右方
							ballObj.xflag = orientation;
						}
					} else if (ballObj.y > balls[i].y) {
						//小球对象在被撞小球的正下方
						ballObj.yflag = orientation;
					} else if (ballObj.y < balls[i].y) {
						//小球对象在被撞小球的正上方
						ballObj.yflag = !orientation;
					}
					//如果碰撞一次，有30%的几率被感染：
					var infect_factor = Math.floor(Math.random() * 100);
					//在潜伏期之内感染概率5%，被感染之后会被染成红色球体
					if (balls[i].isDie == false && balls[i].isHos == false && ballObj.isCure == false) {
						if (balls[i].isInfect == false) {
							if (isMask == true) {
								if (balls[i].isLatent == true && ballObj.isLatent == false) {
									//潜伏期无抗体2%得病有口罩
									if (infect_factor > 0 && infect_factor <= 2 && ballObj.isImm == false) {
										ballObj.style.backgroundColor = "#4169E1";
										ballObj.isLatent = true;
										ballObj.isImm = false;
										//潜伏期有抗体1%得病有口罩
									} else if (infect_factor == 3 && ballObj.isImm == true) {
										ballObj.style.backgroundColor = "#4169E1";
										ballObj.isLatent = true;
										ballObj.isImm = false;
									}
								}
							}
							if (isMask == false) {
								if (balls[i].isLatent == true && ballObj.isLatent == false) {
									//潜伏期无抗体5%得病无口罩
									if (infect_factor > 0 && infect_factor <= 5 && ballObj.isImm == false) {
										ballObj.style.backgroundColor = "#4169E1";
										ballObj.isLatent = true;
										ballObj.isImm = false;
										//潜伏期有抗体1%得病无口罩
									} else if (infect_factor == 6 && ballObj.isImm == true) {
										ballObj.style.backgroundColor = "#4169E1";
										ballObj.isLatent = true;
										ballObj.isImm = false;
									}
								}
							}

							//非潜伏期感染率30%
						} else if (ballObj.isLatent == false && balls[i].isInfect == true) {
							if (isMask == true) {
								//无抗体30%概率得病无口罩
								if (infect_factor > 0 && infect_factor <= 30 && ballObj.isImm == false) {
									ballObj.style.backgroundColor = "#4169E1";
									ballObj.isLatent = true;
									ballObj.isImm = false;

									//有抗体5%概率得病无口罩
								} else if (infect_factor > 30 && infect_factor <= 35 && ballObj.isImm == true) {
									ballObj.style.backgroundColor = "#4169E1";
									ballObj.isLatent = true;
									ballObj.isImm = false;
								}
							}
							if (isMask == false) {
								//无抗体15%概率得病有口罩
								if (infect_factor > 0 && infect_factor <= 15 && ballObj.isImm == false) {
									ballObj.style.backgroundColor = "#4169E1";
									ballObj.isLatent = true;
									ballObj.isImm = false;

									//有抗体3%概率得病有口罩
								} else if (infect_factor > 21 && infect_factor <= 24 && ballObj.isImm == true) {
									ballObj.style.backgroundColor = "#4169E1";
									ballObj.isLatent = true;
									ballObj.isImm = false;
								}
							}
						}
					}
				}
			}
	}
}
