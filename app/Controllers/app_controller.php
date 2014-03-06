<?php
class App_controller extends Controller

{
    public

    function __construct($f3)
    {
        parent::__construct();
    }

    public

    function home($f3)
    {
        $f3->reroute('/signin');
    }

    public

    function signin($f3)
    {
        $model = new user_model();
        echo View::instance()->render('signin.html');
        switch ($f3->get('VERB'))
        {
        case 'GET':
            $this->tpl['sync'] = 'signin.html';
            break;

        case 'POST':
            $f3->set('users', $model->signin($f3, array(
                'login' => $f3->get('POST.login') ,
                'password' => $f3->get('POST.password')
            )));
            if (!$f3->get('users'))
            {
                $f3->reroute('/signin');
            }
            else
            {
                $user = array(
                    'id' => $f3->get('users')->id,
                    'login' => $f3->get('users')->login,
                    'nickname' => $f3->get('users')->pseudo,
                    'lvl' => $f3->get('users')->level,
                    'classe' => $f3->get('users')->classe
                );
                $f3->set('SESSION', $user);
                if ($f3->get('SESSION.nickname') != '')
                {
                    $f3->reroute('/' . $f3->get('SESSION.nickname'));
                }
                else
                {
                    $f3->reroute('/nickname');
                }
            }

            break;
        }
    }

    public

    function register($f3)
    {
        $model = new user_model();
        switch ($f3->get('VERB'))
        {
        case 'POST':
            $f3->set('register', $model->send($f3, array(
                'logininsc' => $f3->get('POST.logininsc') ,
                'passwordinsc' => $f3->get('POST.passwordinsc')
            )));
            if (!$f3->get('register'))
            {

                // $f3->reroute('/signin');

                $this->tpl['sync'] = 'signin.html';
                echo ("erreur");
            }
            else
            {
                $user = array(
                    'id' => $f3->get('register')->id,
                    'login' => $f3->get('register')->login,
                    'lvl' => $f3->get('register')->level
                );
                $f3->set('SESSION', $user);
                $f3->reroute('/nickname');
                break;
            }
        }
    }

    public

    function Fbregister($f3)
    {
        $model = new user_model();
        $f3->set('fbregister', $model->registerFacebook($f3));
        if (!$f3->get('fbregister'))
        {
            echo ("error");
            /*
            if (!$f3->get('SESSION')) {
            $f3->set('fbregistered',$model->registeredFacebook($f3));
            $user = array(
            'id' => $f3->get('fbregistered')->id,
            'login' =>$f3->get('fbregistered')->login,
            'lvl' =>$f3->get('fbregistered')->level,
            'nickname' =>$f3->get('fbregistered')->pseudo
            );
            $f3->set('SESSION', $user);
            $f3->reroute('/menu');
            } */
        }
        else
        {
            $user = array(
                'id' => $f3->get('fbregister')->id,
                'login' => $f3->get('fbregister')->login,
                'lvl' => $f3->get('fbregister')->level
            );
            $f3->set('SESSION', $user);
            $f3->reroute('/nickname');
        }
    }

    public

    function getnickname($f3)
    {
        $model = new user_model();
        switch ($f3->get('VERB'))
        {
        case 'GET':
            echo View::instance()->render('nickname.html');
            break;

        case 'POST':
            $f3->set('users', $model->toto($f3, array(
                'nicknameinsc' => $f3->get('POST.nicknameinsc') ,
                'login' => $f3->get('SESSION.login'),
                'classe' => $f3->get('POST.radio')
            )));
            

             $user = array(
                'id' => $f3->get('users')->id,
                'login' => $f3->get('users')->login,
                'lvl' => $f3->get('users')->level,
                'classe' => $f3->get('users')->classe,
                'nickname' => $f3->get('users')->pseudo
                
            );

            $f3->set('SESSION', $user);


            $f3->reroute('/' . $f3->get('SESSION.nickname'));
            break;
        }
    }

    public

    function menu($f3)
    {
        $model = new user_model();
        /* $top =     $f3->get('users', $model->top($f3, array(
        'pseudo' => $f3->get('pseudo'),
        'lvl' => $f3->get('level')
        )));
        echo($top); // outputs 4
        */
        $top = $model->top($f3);
        $f3->set('top', $top);
        echo View::instance()->render('home.html');
    }

    public

    function signout($f3)
    {
        session_destroy();
        $f3->reroute('/signin');
    }
}



?>