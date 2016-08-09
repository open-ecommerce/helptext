<?php

namespace app\controllers\api;

/**
* This is the class for REST controller "ProfileController".
*/

use yii\filters\AccessControl;
use yii\helpers\ArrayHelper;

class ProfileController extends \yii\rest\ActiveController
{
public $modelClass = 'app\models\Profile';
}
