function start(){
	if(hoscap >= 300) {
		document.getElementById("hospital_cap").innerText = 300;
		document.getElementById("hospital_left").innerText = 300;
		hoscap = 300;
	}
	else {
		document.getElementById("hospital_cap").innerText = hoscap;
		document.getElementById("hospital_left").innerText = hoscap;
	}
		
	if( isNaN(peopleNum) || isNaN(infectNum) || isNaN(peopleSpeed)) {
		alert("感染人数与人群密度二者不能为空！");
		return;
	} 
	
	if(peopleSpeed > 5)
		peopleSpeed = 5;
	
	if(peopleNum <= 200) 
		createBalls(peopleNum, false, false, peopleSpeed);
	else if(peopleNum > 200)
		createBalls(200, false, false, peopleSpeed);
	else	
		alert("请输入正确的数字");
	
	if(infectNum <= 100)
		createBalls(infectNum, true, false, peopleSpeed);
	else if(infectNum > 100) 
		createBalls(100, true, false, peopleSpeed);
	else 
		alert("清输入正确的数字")
		
	testEnding(balls);
}