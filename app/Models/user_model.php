<?php
class user_model extends model{
    
    private $mapper;

    function __construct()
    {
        parent::__construct();
        $this->mapper=$this->getMapper('users');
     }
  


  // Fonction de connexion
  function signin($f3, $params)
  {
    $connect=$this->mapper;
    $connect->load('login="'.$params['login'].'" AND password ="'.$params['password'].'"');
    return $connect;
  }



  function send($f3, $params)
  {
    $connect=$this->mapper;
    $connect->login = $params['logininsc'];
    $connect->password = $params['passwordinsc'];
   


    $connect->save();
    return $connect;
  }

  function toto($f3, $params) {
      $connect=$this->mapper;
      $connect->load('login="'.$params['login'].'"');
      $connect->pseudo = $params['nicknameinsc'];
      $connect->save();
  }

    function top() {
    $connect=$this->mapper;
    return $connect->find(NULL, array('order' => 'level DESC', 'limit' => 10));
    //return $connect;
  }

}
?>