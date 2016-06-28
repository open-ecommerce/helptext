<?php

namespace app\controllers\api;

/**
* This is the class for REST controller "TextController".
*/

use yii\filters\AccessControl;
use yii\helpers\ArrayHelper;

class TextController extends \yii\rest\ActiveController
{
public $modelClass = 'app\models\Text';
}
