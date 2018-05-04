<?php

if($_POST)
{
	$to_email = "alexandra.pasyuta@gmail.com"; //Recipient email, Replace with own email here
	$subject = "***Получено с сайта ALEXWEIT.TMWEB.RU***";
	
	//check if its an ajax request, exit if not
    if(!isset($_SERVER['HTTP_X_REQUESTED_WITH']) AND strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
		
		$output = json_encode(array( //create JSON data
			'type'=>'error', 
			'text' => 'Sorry Request must be Ajax POST'
		));
		die($output); //exit script outputting json data
    } 
	
	//Sanitize input data using PHP filter_var().
	$name		= filter_var($_POST["name"], FILTER_SANITIZE_STRING);
	$email		= filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
	$message	= filter_var($_POST["message"], FILTER_SANITIZE_STRING);
	
	//additional php validation
	if(strlen($name)<4){ // If length is less than 4 it will output JSON error.
		$output = json_encode(array('type'=>'error', 'text' => 'Name is too short or empty'));
		die($output);
	}
	if(!filter_var($email, FILTER_VALIDATE_EMAIL)){ //email validation
		$output = json_encode(array('type'=>'error', 'text' => 'Please enter a valid email'));
		die($output);
	}
	
	if(strlen($message)<3){ //check emtpy message
		$output = json_encode(array('type'=>'error', 'text' => 'You forgot the most important part..'));
		die($output);
	}
	
	//email body
	$message_body = $message."\r\n\r\n-".$name."\r\nEmail : ".$email;
	
	//proceed with PHP email.
	$headers = 'From: '.$name.'' . "\r\n" .
	'Reply-To: '.$user_email.'' . "\r\n" .
	'X-Mailer: PHP/' . phpversion();
	
	$send_mail = mail($to_email, $subject, $message_body, $headers);
	
	if(!$send_mail)
	{
		//If mail couldn't be sent output error. Check your PHP email configuration (if it ever happens)
		$output = json_encode(array('type'=>'error', 'text' => 'Could not send mail! Please check your PHP mail configuration.'));
		die($output);
	}else{
		$output = json_encode(array('type'=>'message', 'text' => 'Hi '.$name .' We will reply as soon as possible!'));
		die($output);
	}
}