<?php
namespace app\commands;

use Yii;
use yii\console\Controller;

class RbacController extends Controller
{
    public function actionInit()
    {
        $auth = Yii::$app->authManager;

        // add "viewUtilities" permission
        $viewUtilities = $auth->createPermission('viewUtilities');
        $viewUtilities->description = 'Can view the Utilities menu';
        $auth->add($viewUtilities);


        // add "author" role and give this role the "createPost" permission
        $supervisor = $auth->createRole('supervisor');
        $auth->add($supervisor);
        $auth->addChild($author, $viewUtilities);


    }
}