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

        return $rules;
    }

    /** @inheritdoc */
    public function attributeLabels()
    {
        return [
            'skills' => Yii::t('userextended', 'This are the skills'),
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
