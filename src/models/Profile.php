<?php

/**
 * @copyright Copyright &copy; Gogodigital Srls
 * @company Gogodigital Srls - Wide ICT Solutions
 * @website http://www.gogodigital.it
 * @github https://github.com/cinghie/yii2-user-extended
 * @license GNU GENERAL PUBLIC LICENSE VERSION 3
 * @package yii2-user-extended
 * @version 0.5.8
 */

namespace app\models;
use Yii;
use dektrium\user\models\Profile as BaseProfile;

class Profile extends BaseProfile
{

    public function scenarios()
    {
        $scenarios = parent::scenarios();

        // add skils to scenarios
        $scenarios['create'][]   = 'skills';
        $scenarios['update'][]   = 'skills';
        $scenarios['register'][] = 'skills';

        
        

        return $scenarios;
    }

    public function rules()
    {
        $rules = parent::rules();

        // add skills rules
        $rules['skillsRequired'] = ['skills', 'required'];
        $rules['skillsLength']   = ['skills', 'string', 'max' => 255];

        $rules['availabilityRequired'] = ['availability', 'required'];
        $rules['availabilityLength']   = ['availability', 'integer'];

        // add firstname rules
        $rules['firstnameRequired'] = ['firstname', 'required'];
        $rules['firstnameLength']   = ['firstname', 'string', 'max' => 255];

        // add lastname rules
        $rules['lastnameRequired']  = ['lastname', 'required'];
        $rules['lastnameLength']    = ['lastname', 'string', 'max' => 255];

        // add birthday rules
        $rules['birthdayRequired']  = ['birthday', 'safe'];
        $rules['birthdayLength']    = ['birthday', 'date', 'format' => 'yyyy-mm-dd'];

        $rules['countries_idRequired'] = ['countries_id', 'safe'];
        $rules['countries_idLength']   = ['countries_id', 'integer'];
        
        
        return $rules;
    }

    /** @inheritdoc */
    public function attributeLabels()
    {
        return [
            'firstname' => Yii::t('userextended', 'Firstname'),
            'lastname' => Yii::t('userextended', 'Lastname'),
            'birthday' => Yii::t('userextended', 'Birthday'),            
            'availability' => Yii::t('userextended', 'Availability'),            
            'skills' => Yii::t('userextended', 'Skills'),
        ];
    }

    /**
     * @return \yii\db\ActiveQueryInterface
     */
    public function getAccount()
    {
        return $this->hasOne($this->module->modelMap['Account'], ['user_id' => 'user_id']);
    }

    /**
     * @return \yii\db\ActiveQueryInterface
     */
    public function getAccountAttributes()
    {
        return $this->hasOne($this->module->modelMap['Account'], ['user_id' => 'user_id'])->asArray()->one();
    }

}
