<?php

namespace app\helpers;

use Yii;
use yii\helpers\ArrayHelper;

class OeHelpers {

    public static function logger($msg, $where = 'generic') {
        if ($where === "tomail") {
            \Yii::$app->mailer->compose()
                    ->setFrom('webmaster@nnls-helptext.ml')
                    ->setTo(['eduardo@open-ecommerce.org', 'mariano@open-ecommerce.org'])
                    ->setSubject('Alert from NNLS HelpText')
                    ->setHtmlBody($msg)
                    ->send();
        } else {
            if (\Yii::$app->settings->get('helptext.generate_logs')) {
                \Yii::info($msg, $where);
            }
        }
    }
    
    public static function isMobileNumber ($number){
        $response = "Landline (not sure will receive SMS)";
        if (preg_match("/^\+447(?:[1-4]\d\d|5(?:0[0-8]|[13-9]\d|2[0-35-9])|624|7(?:0[1-9]|[1-7]\d|8[02-9]|9[0-689])|8(?:[014-9]\d|[23][0-8])|9(?:[04-9]\d|1[02-9]|2[0-35-9]|3[0-689]))\d{6}$/",$number, $output)) {
            $response = "Mobile Phone";
        }
        return $response;

    }
    

}
