var txt = "Select an option to continue";
var i = 0;
var getAlgo = "AES"
var getAlgodec = "AES"
var getval = 0
function typeWriter() {
	var speed = 50;
	if (i < txt.length) {
    document.getElementById("head1").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}
$(function(){

	var body = $('body'),
		stage = $('#stage'),
		back = $('a.back');

	$('#step1 .encrypt').click(function(){
		body.attr('class', 'encrypt');
		step(2);
	});

	$('#step1 .decrypt').click(function(){
		body.attr('class', 'decrypt');
		step(2);
	});
	$('#step2 .button').click(function(){
		$(this).parent().find('input').click();
	});
	var file = null;
	$('#step2').on('change', '#encrypt-input', function(e){
		if(e.target.files.length!=1){
			alert('Please select a file to encrypt!');
			return false;
		}
		file = e.target.files[0];
		if(file.size > 1024*1024){
			alert('Please choose files smaller than 1mb, otherwise you may crash your browser.');
			return;
		}
		var algo = document.getElementById("encAlgo");
		getAlgo = algo.options[algo.selectedIndex].text;
		step(3);
	});
	$('#step2').on('change', '#decrypt-input', function(e){
		if(e.target.files.length!=1){
			alert('Please select a file to decrypt!');
			return false;
		}
		file = e.target.files[0];
		step(3);
	});
	$('a.button.process').click(function(){

		var input = $(this).parent().find('input[type=password]'),
			a = $('#step4 a.download'),
			password = input.val();
		input.val('');
		if(password.length<5){
			alert('Please choose a longer password!');
			return;
		}
		var reader = new FileReader();
		if(body.hasClass('encrypt')){
			reader.onload = function(e){
				if(getAlgo ==="AES"){
					var encrypted = CryptoJS.AES.encrypt(e.target.result, password);
					encrypted = '1' + encrypted;	
					a.attr('href', 'data:application/octet-stream,' + encrypted);
					a.attr('download', file.name + '.encrypted');
					step(4);
				}
				if(getAlgo ==="DES"){
					var encrypted = CryptoJS.DES.encrypt(e.target.result, password);
					encrypted = '2' + encrypted;
					a.attr('href', 'data:application/octet-stream,' + encrypted);
					a.attr('download', file.name + '.encrypted');
					step(4);
				}
				if(getAlgo ==="3DES"){
					var encrypted = CryptoJS.TripleDES.encrypt(e.target.result, password);
					encrypted = '3' + encrypted;
					a.attr('href', 'data:application/octet-stream,' + encrypted);
					a.attr('download', file.name + '.encrypted');
					step(4);
				}
			};
			reader.readAsDataURL(file);
		}
		else {
			reader.onload = function(e){
				var ciphertext = e.target.result
				if(ciphertext.charAt(0)==="1"){				
					ciphertext = ciphertext.replace('1','')	
					var decrypted = CryptoJS.AES.decrypt(ciphertext, password)
											.toString(CryptoJS.enc.Latin1);
					if(!/^data:/.test(decrypted)){
						alert("Invalid pass phrase or file! Please try again.");
						return false;
					}
					a.attr('href', decrypted);
					a.attr('download', file.name.replace('.encrypted',''));
					step(4);
				}
				if(ciphertext.charAt(0)==="2"){
					ciphertext = ciphertext.replace('2','')	
					var decrypted = CryptoJS.DES.decrypt(ciphertext, password)
										.toString(CryptoJS.enc.Latin1);
					if(!/^data:/.test(decrypted)){
						alert("Invalid pass phrase or file! Please try again.");
						return false;
					}
					a.attr('href', decrypted);
					a.attr('download', file.name.replace('.encrypted',''));
					step(4);
				}
				if(ciphertext.charAt(0)==="3"){
					ciphertext = ciphertext.replace('3','')
					var decrypted = CryptoJS.TripleDES.decrypt(ciphertext, password)
										.toString(CryptoJS.enc.Latin1);
					if(!/^data:/.test(decrypted)){
						alert("Invalid pass phrase or file! Please try again.");
						return false;
					}
					a.attr('href', decrypted);
					a.attr('download', file.name.replace('.encrypted',''));
					step(4);
				}
			};
			reader.readAsText(file);
		}
	});
	back.click(function(){
		$('#step2 input[type=file]').replaceWith(function(){
			return $(this).clone();
		});
		step(1);
	});
	function step(i){

		if(i == 1){
			back.fadeOut();
		}
		else{
			back.fadeIn();
		}
		stage.css('top',(-(i-1)*100)+'%');
	}

});
