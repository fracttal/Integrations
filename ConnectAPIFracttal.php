<?php

$host='app.fracttal.com';
$port='443';
$idApp ='[APIID_CLIENTE]';
$keySecret = '[ClIENT_SECRET]';


$method='POST';
$route='/api/items';
$payload = array(
    "id_type_item" => "2",
    "code" => "EQ202010209",
    "field_1"=>"Equipo Prueba"
    );

if($payload != ''){
    $payloadEncoded = json_encode($payload);

}else{
    $payloadEncoded = '';
}

CallAPI($method, $route, $payloadEncoded);

///************************************** */
//Llamado al REST API usando curl
function CallAPI($method, $route, $payload = "")
{
    global $host, $port, $idApp;
    $curl = curl_init();
    $url = "https://". $host.$route;

    //parametros para generar hawk auth
    $nonce = makeRandomString(5);
    $timespan = time();

    //construye el hmac
    $hmac = createHMACAuthHeader($nonce,$method,$route,$host,$timespan,$port);
    $authHeader = 'Authorization: Hawk id="' .$idApp.'", ts="'.$timespan.'", nonce="'.$nonce.'", mac="'.$hmac . '"';

    //Se contruye el header
    $header = array();
    if($payload != ''){        
        $header = array("Content-type: application/json", 
                        "Content-Length: " .strlen($payload),
                        $authHeader);       
    }else{
        $header = array($authHeader); 
    }
    
    
    //Parametros segun metodo utilizado
    switch ($method)
    {
        case "POST":
            curl_setopt($curl, CURLOPT_POST, 1);

            if ($payload != '')
                curl_setopt($curl, CURLOPT_POSTFIELDS, $payload);
            break;
        case "PUT":
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST,  "PUT");

            if ($payload != '')
                curl_setopt($curl, CURLOPT_POSTFIELDS, $payload);
            break;
        
        
    }

    // Authentication y headers:    
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_HTTPHEADER, $header);

    $result = curl_exec($curl);

    if ($result === false)
    {
        throw new Exception('Curl error: ' . curl_error($curl));
        
        
    }else{
        echo $result;
    }

   
    curl_close($curl);

    return $result;
}

//Generacion de string hmac de autenticacion Hawk
function createHMACAuthHeader($nonce, $method, $route, $host, $timespan, $port){
    global $keySecret;
    $payloadHeader = 'hawk.1.header';
    $macString = $payloadHeader ."\n" . $timespan . "\n" . $nonce . 
            "\n" . $method . "\n" . $route . "\n" . $host . 
            "\n" . $port . "\n\n\n";

    $hmactext = hash_hmac('sha256', $macString, $keySecret, true);

    return base64_encode($hmactext);
}

//Metodo para generar random string
function makeRandomString($length){

    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $randstring = '';
    for ($i = 0; $i < $length; $i++) {
        $randstring = $randstring . $characters[rand(0, strlen($characters))];
    }
    return $randstring;
}



?>