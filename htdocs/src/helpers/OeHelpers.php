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

}
