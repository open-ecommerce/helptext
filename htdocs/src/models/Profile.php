<?php

/**
 * @license GNU GENERAL PUBLIC LICENSE VERSION 3
 * @package yii2-user-extended
 * @version 0.5.8
 */

namespace app\models;

use Yii;
use dektrium\user\models\Profile as BaseProfile;
use yii\db\Query;

class Profile extends BaseProfile {
    

    public function scenarios() {
        $scenarios = parent::scenarios();

        // add skils to scenarios
        $scenarios['create'][] = 'skills';
        $scenarios['update'][] = 'skills';
        $scenarios['register'][] = 'skills';


        return $scenarios;
    }

    public function rules() {
        $rules = parent::rules();

        // add skills rules
        $rules['skillsLength'] = ['skills', 'string', 'max' => 255];

        $rules['availabilityRequired'] = ['availability', 'required'];
        $rules['availabilityLength'] = ['availability', 'integer'];

        // add firstname rules
        $rules['firstnameRequired'] = ['firstname', 'required'];
        $rules['firstnameLength'] = ['firstname', 'string', 'max' => 255];

        // add lastname rules
        $rules['lastnameRequired'] = ['lastname', 'required'];
        $rules['lastnameLength'] = ['lastname', 'string', 'max' => 255];

        // add full name
        $rules['userName'] = ['userName', 'safe'];

        
        // add firstname rules
        $rules['phone'] = ['phone', 'required'];
        $rules['phone'] = ['phone', 'string', 'max' => 255];        
        
        
        // add birthday rules
        $rules['birthdayRequired'] = ['birthday', 'safe'];
        $rules['birthdayLength'] = ['birthday', 'date', 'format' => 'yyyy-mm-dd'];

        $rules['id_countryRequired'] = ['id_country', 'safe'];
        $rules['id_countryLength'] = ['id_country', 'integer'];


        return $rules;
    }

    /** @inheritdoc */
    public function attributeLabels() {
        return [
            'firstname' => Yii::t('userextended', 'First Name'),
            'lastname' => Yii::t('userextended', 'Surname'),
            'userName' => Yii::t('userextended', 'Helper Name'),
            'phone' => Yii::t('userextended', 'Phone'),
            'birthday' => Yii::t('userextended', 'Birthday'),
            'availability' => Yii::t('userextended', 'Taking calls ?'),
            'userRole' => Yii::t('userextended', 'userRole'),
            'skills' => Yii::t('userextended', 'Skills'),
            'id_country' => Yii::t('userextended', 'Nationality'),
        ];
    }

    /**
     * @return \yii\db\ActiveQueryInterface
     */
    public function getProfile() {
        return $this->hasOne($this->module->modelMap['Profile'], ['user_id' => 'user_id']);
    }

    /**
     * @return \yii\db\ActiveQueryInterface
     */
    public function getProfileAttributes() {
        return $this->hasOne($this->module->modelMap['Profile'], ['user_id' => 'user_id'])->asArray()->one();
    }

    /**
     * check the next available helper
     * @return user_id
     */
    public function getNextUser() {
        $query = new Query;
        $query->select('user_id')
                ->from('profile')
                ->where('availability = 1')
                ->limit(1);        
        $result = $query->all();
        
        if (!empty($result)) {
            return $result[0]['user_id'];        
        } else {
            return NULL;
        }

    }
    
    
    public function getUserProfile() {
        if (!\Yii::$app->user->isGuest) {
            return \Yii::$app->user->identity->profile;
        } else {
            return false;
        }
    }

    
    public function getUserName() {
        if (isset($this->firstname)) {
            return $this->firstname . " " . $this->lastname;
        }
    }    
    

    
/**
 * Returns user role name according to RBAC
 * @return string
 */
public function getRoleName($userId)
{
    
    $roles = Yii::$app->authManager->getRolesByUser($userId);
    if (!$roles) {
        return null;
    }

    reset($roles);
    /* @var $role \yii\rbac\Role */
    $role = current($roles);

    return $role->name;
}   

    


}
