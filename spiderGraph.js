 Points = [];
  Titles = [];
  Weight = [];
  weightedPoints = [];

  centreX = ($('canvas').width()/2);
  centreY = ($('canvas').height()/2);

  circleRadius = 300;

  function pushToArrays(){
    Points = [];
    Titles = [];
    Weight = [];
    weightedPoints = [];
    $('input.question').each(function(){
      var val = $(this).val()
      Titles.push(val);
    })
    $('select.answer').each(function(){
      var val = $(this).val();
      Weight.push(val);
    })
  }

  function generateQuestions(){
    scoredOutOf = $('.scoredOutOf').val();
    numberOfQuestions = $('.input').val();
    if ( (2 < numberOfQuestions && numberOfQuestions <= 12 && 2 <= scoredOutOf <= 15 )){
    content = "";
    for(i=0;i<numberOfQuestions;i++){
      content += "Question ";
      content += i+1;
      content += " <input value=\"Q" + (i+1) + "\"";
      content += "class=\"question\">";
      content += " Answer "
      content += i+1;
      content += " <select class=\"answer";
      content += "\">";
      for(x = 1; x <= scoredOutOf; x++){
        content += "<option value=" + ( circleRadius / scoredOutOf )*x + ">";
        content += x;
        content += "</option>";
      }
      content += "</select>";
      content += "<br><br>"
    }
      content += "<span onclick=\"answerSubmitted()\" class=\"submitNumberOfQuestions\" style=\"background-color: #999; color: #fff ;padding:5px; cursor: pointer;\">Generate Snowflake Diagram</span>";
    $(".questions").html(content);
    $('.errorMessage').html('No Error');
    }else if ( scoredOutOf< 2 || 15 < scoredOutOf ) {
      $('.errorMessage')
    }
    else{
      $('.errorMessage').html('Limit set to more than 2, less than 12');
      $('.questions').html('');
    }
    if ( isNaN(numberOfQuestions) ){
      $('.errorMessage').html('That\'s not a number');
      $('.questions').html('');
    }
    if (numberOfQuestions == ""){
      $('.errorMessage').html('We don\'t have a value')
    }
  }

  function convertPolarToCartesian(radius,rotation){
    x = Math.round(radius*Math.cos(rotation)) + centreX;
    y = Math.round(radius*Math.sin(rotation)) + centreY;
    return [x,y];
  }

  function calculateArcLength(){
    unitOfRotation = 2*Math.PI/Titles.length;
  }

  function answerSubmitted(){
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    pushToArrays();
    createPath();
  }

  function createPath(){
    calculateArcLength();
    for (i=0;i<Titles.length;i++){
      polarPoint = unitOfRotation*i;
      Points.push(convertPolarToCartesian(circleRadius,polarPoint));
    }

    for (i=0 ; i<Weight.length ; i++) {
      polarPoint = unitOfRotation*i;
      weightedPoints.push(convertPolarToCartesian(Weight[i],polarPoint));
    };

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
      ctx.beginPath();
      for ( i=1; i<=scoredOutOf; i++){
        ctx.arc(centreX,centreY,((circleRadius/scoredOutOf)*i),0,2*Math.PI);
      }
      for (var i = Points.length - 1; i >= 0; i--) {
        ctx.moveTo(centreX,centreY);
        ctx.lineTo(Points[i][0],Points[i][1]);
      };
      ctx.moveTo(weightedPoints[0][0],weightedPoints[0][1]);
      for (i=0 ; i<weightedPoints.length; i++) {

        logX = Points[i][0] - centreX;
        if ( isNaN(Math.log(logX)) === false ){
          xMod = 20;
        }else {
          xMod = -40;
        }if( logX == 0 ){
          xMod = -10;
        }

        logY = Points[i][1] - centreY;
        if ( isNaN(Math.log(logY)) === false ){
          yMod = 30;
        } else {
          yMod = -30;
        }
        if ( logY == 0 ){
          yMod = 2;
        }

        ctx.fillText(Titles[i],Points[i][0] + xMod , Points[i][1] + yMod );
        ctx.lineTo(weightedPoints[i][0],weightedPoints[i][1]);
      };
      ctx.closePath();
      ctx.strokeStyle = '#999';
      ctx.stroke();
  }

$('canvas').click(function(){
  var canvas = document.getElementById('myCanvas');
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
})

generateQuestions();
