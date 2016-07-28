<?php

namespace app\helpers;

use Yii;
use yii\helpers\ArrayHelper;

class OeHelpers
{
    public static function logger($msg, $where='generic')
    {

        if (\Yii::$app->settings->get('helptext.generate_logs')) {
            \Yii::info($msg, $where);
        }
    }
    
    
}