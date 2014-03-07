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
    if ($test === NULL) {
    }
    else {
      return $test;
    }
  }

  // Fonction inscription

  function send($f3, $params)
  {
    $connect = $this->mapper;
    $test = $connect->load('login="' . $params['logininsc'] . '"');
    $f3->set('toast', $test);
    if ($test === false) {
      $connect->login = $params['logininsc'];
      $connect->password = $params['passwordinsc'];
      $connect->save();
      return $connect;
    }
    else {
    }
  }

  // Fonction choix perso/pseudo

  function toto($f3, $params)
  {
    $classe = $params['classe'];
    switch ($classe) {
    case 1:
      $classe = 'Ingenieur';
      break;

    case 2:
      $classe = 'Assassin';
      break;

    case 3:
      $classe = 'Assaut';
      break;
    }

    $connect = $this->mapper;
    $connect->load('login="' . $params['login'] . '"');
    $connect->pseudo = $params['nicknameinsc'];
    $connect->classe = $classe;
    $connect->save();
    return $connect;
  }

  // Fonction récupérant le top 10 joueurs par niveau

  function top()
  {
    $connect = $this->mapper;
    return $connect->find(NULL, array(
      'order' => 'level DESC',
      'limit' => 9
    ));

    // return $connect;

  }

  // Fonction Enregistrer via api Facebook

  function registerFacebook()
  {
    $connect = $this->mapper;
    require_once ("facebook.php");

    $config = array(
      'appId' => '610575689017590',
      'secret' => '7ae43efc565bd7b8c4d6b27b43f30ea5',
      'fileUpload' => false, // optional
      'allowSignedRequest' => false

    );
    $facebook = new Facebook($config);
    $user_id = $facebook->getUser();
    if ($user_id) {

      try {
        $test = $connect->load('login="' . $user_id . '"');
        if ($test === false) {
          $user_profile = $facebook->api('/me', 'GET');
          $connect->login = $user_id;
          $connect->password = $user_profile['name'];
          $connect->save();

          // $f3->set('id_fb', $connect);

          return $connect;
        }
        else {
        }
      }

      catch(FacebookApiException $e) {

        $login_url = $facebook->getLoginUrl();
        echo 'Please <a href="' . $login_url . '">login.</a>';
        error_log($e->getType());
        error_log($e->getMessage());
      }
    }
    else {

      $login_url = $facebook->getLoginUrl();
      echo 'Please <a href="' . $login_url . '">login.</a>';
    }
  }

// Fonction pour l'api

  function api()
  {
    $connect = $this->mapper;
    return $connect;
  }
}

?>
