<?php
class user_model extends model

{
  private $mapper;
  function __construct()
  {
    parent::__construct();
    $this->mapper = $this->getMapper('users');
  }

  // Fonction de connexion

  function signin($f3, $params)
  {
    $connect = $this->mapper;
    $test = $connect->load('login="' . $params['login'] . '" AND password="' . $params['password'] . '"');
    if ($test === NULL)
    {
    }
    else
    {
      return $test;
    }
  }

  function send($f3, $params)
  {
    $connect = $this->mapper;
    $test = $connect->load('login="' . $params['logininsc'] . '"');
    $f3->set('toast', $test);
    if ($test === false)
    {
      $connect->login = $params['logininsc'];
      $connect->password = $params['passwordinsc'];
      $connect->save();
      return $connect;
    }
    else
    {
    }
  }

  function toto($f3, $params)
  {
    $connect = $this->mapper;
    $connect->load('login="' . $params['login'] . '"');
    $connect->pseudo = $params['nicknameinsc'];
    $connect->save();
  }

  function top()
  {
    $connect = $this->mapper;
    return $connect->find(NULL, array(
      'order' => 'level DESC',
      'limit' => 10
    ));

    // return $connect;

  }

  function registerFacebook()
  {
    $connect = $this->mapper;
    require_once ("facebook.php");

    $config = array(
      'appId' => '610575689017590',
      'secret' => '7ae43efc565bd7b8c4d6b27b43f30ea5',
      'fileUpload' => false, // optional
      'allowSignedRequest' => false

      // optional, but should be set to false for non-canvas apps

    );
    $facebook = new Facebook($config);
    $user_id = $facebook->getUser();
    if ($user_id)
    {

      // We have a user ID, so probably a logged in user.
      // If not, we'll get an exception, which we handle below.

      try
      {
        $test = $connect->load('login="' . $user_id . '"');
        if ($test === false)
        {
          $user_profile = $facebook->api('/me', 'GET');
          $connect->login = $user_id;
          $connect->password = $user_profile['name'];
          $connect->save();

          // $f3->set('id_fb', $connect);

          return $connect;
        }
        else
        {
        }
      }

      catch(FacebookApiException $e)
      {

        // If the user is logged out, you can have a
        // user ID even though the access token is invalid.
        // In this case, we'll get an exception, so we'll
        // just ask the user to login again here.

        $login_url = $facebook->getLoginUrl();
        echo 'Please <a href="' . $login_url . '">login.</a>';
        error_log($e->getType());
        error_log($e->getMessage());
      }
    }
    else
    {

      // No user, print a link for the user to login

      $login_url = $facebook->getLoginUrl();
      echo 'Please <a href="' . $login_url . '">login.</a>';
    }
  }

  /*   function registeredFacebook() {
  $connect=$this->mapper;
  $pong = $f3->set('id_fb');
  return $pong;
  }*/
  

  function apiDB() 
  {
    $connect = $this->mapper;
    return $connect;
  }

}


?>