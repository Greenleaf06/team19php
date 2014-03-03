<?php
class Controller

{
  protected $tpl;
  protected $model;
  public

  function __construct()
  {
    $f3 = Base::instance();
    if ($f3->get('PATTERN') != '/signin' && $f3->get('PATTERN') != '/send' && $f3->get('PATTERN') != '/sendfb' && $f3->get('PATTERN') != '/api' && !$f3->get('SESSION'))
    {
      $f3->reroute('/signin');
    }
  }

  public

  function beforeroute()
  {
    $model = substr(get_class($this) , 0, strpos(get_class($this) , '_') + 1) . 'model';
    if (class_exists($model))
    {
      $this->model = new $model();
    }
  }
}

?>
