<?php

namespace app\models;
use dektrium\user\models\Profile as BaseProfile;
use yii\web\UploadedFile;
use Yii;
use dektrium\user\models\User;

class Profile extends BaseProfile {

  public $skills;
    
  public function rules() {
        $rules = parent::rules();
  
        $rules['skills'] = ['skills', 'text'];
        return $rules;
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels() {
        $labels = parent::attributeLabels();
        $labels['bio'] = \Yii::t('user', 'Biography');
        $labels['skills'] = \Yii::t('user', 'Expertise');
        return $labels;
    }

}


