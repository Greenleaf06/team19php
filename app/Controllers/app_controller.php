<?php
class App_controller extends Controller
{
    
    public function __construct($f3)
    {
        parent::__construct();

    }
    
    
    public function home($f3)
    {
        
    }
    

    public function signin($f3)
    {
        $model = new user_model();
        echo View::instance()->render('signin.html');
        
        switch ($f3->get('VERB')) {
            case 'GET':
                $this->tpl['sync'] = 'signin.html';
                break;
            case 'POST':
                $f3->set('users', $model->signin($f3, array(
                    'login' => $f3->get('POST.login'),
                    'password' => $f3->get('POST.password')
                )));
                if (!$f3->get('users')) {
                    $f3->set('error', $f3->get('loginError'));
                    $this->tpl['sync'] = 'signin.html';
                } else {
                    
                    $user = array(
                        'id' => $f3->get('users')->id,
                        'login' => $f3->get('users')->login,
                        'nickname' => $f3->get('users')->pseudo,
                        'lvl' => $f3->get('users')->level
                    );
                    $f3->set('SESSION', $user);
                    if ($f3->get('SESSION.nickname') != '') {
                        $f3->reroute('/' . $f3->get('SESSION.nickname'));
                    } else {
                        $f3->reroute('/nickname');
                        
                    }
                }
                break;
        }
    }
    
    
    
    
    public function register($f3)
    {
        $model = new user_model();
        switch ($f3->get('VERB')) {
            
            
            case 'POST':
            $login = $model->send($f3, array(
                    'logininsc' => $f3->get('POST.logininsc'),
                    'passwordinsc' => $f3->get('POST.passwordinsc')
                ));
                //var_dump($user);
                // $f3->set('users', $model->send($f3, array(
                //     'logininsc' => $f3->get('POST.logininsc'),
                //     'passwordinsc' => $f3->get('POST.passwordinsc')
                // )));
                    
                $user = array(
                   'id' => $login->id,
                   'login' => $login->login,
                   'lvl' => $login->level
                );

                $f3->set('SESSION', $user);
             
                $f3->reroute('/nickname');
                
                break;
        }
    }
    
    public function Fbregister($f3)
    {
        
        
        
        $model = new user_model();
        require_once("facebook.php");
        
        $config = array(
            'appId' => '610575689017590',
            'secret' => '7ae43efc565bd7b8c4d6b27b43f30ea5',
            'fileUpload' => false, // optional
            'allowSignedRequest' => false // optional, but should be set to false for non-canvas apps
        );
        
        $facebook = new Facebook($config);
        
        $user_id = $facebook->getUser();
        
        echo ($user_id);
        if ($user_id) {
            
            // We have a user ID, so probably a logged in user.
            // If not, we'll get an exception, which we handle below.
            try {
                
                $user_profile = $facebook->api('/me', 'GET');
                echo "Name: " . $user_profile['name'];
                
            }
            catch (FacebookApiException $e) {
                // If the user is logged out, you can have a 
                // user ID even though the access token is invalid.
                // In this case, we'll get an exception, so we'll
                // just ask the user to login again here.
                $login_url = $facebook->getLoginUrl();
                echo 'Please <a href="' . $login_url . '">login.</a>';
                error_log($e->getType());
                error_log($e->getMessage());
            }
        } else {
            
            // No user, print a link for the user to login
            $login_url = $facebook->getLoginUrl();
            echo 'Please <a href="' . $login_url . '">login.</a>';
            
        }
        
        echo ($user_id);
        
        
        echo View::instance()->render('signin.html');
        
        /*switch ($f3->get('VERB')) {
        
        
        case 'POST':
        $f3->set('users', $model->send($f3, array(
        'logininsc' => $f3->get('POST.logininsc'),
        'passwordinsc' => $f3->get('POST.passwordinsc')
        )));
        
        
        
        
        
        break;         }*/
        
        
    }
    
    
    
    public function getnickname($f3)
    {
        $model = new user_model();
        
        switch ($f3->get('VERB')) 
        {
            case 'GET':
                echo View::instance()->render('nickname.html');
                break;
            
            case 'POST':
                $f3->set('users', $model->toto($f3, array(
                    'nicknameinsc' => $f3->get('POST.nicknameinsc'),
                    'login' => $f3->get('SESSION.login')
                )));
                $f3->set('SESSION.nickname', $f3->get('POST.nicknameinsc'));
                
                
                $f3->reroute('/menu');
                break;        
        }
        
    }
    
    public function menu($f3)
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

    
    public function signout($f3)
    {
        session_destroy();
        $f3->reroute('/signin');
    }
    
    
}

?>