<?php

namespace app\models;

use Yii;
use \app\models\base\Contact as BaseContact;

/**
 * This is the model class for table "contact".
 */
class Contact extends BaseContact
{
    
public static function get_contact_name($id){
    $contacts = Contact::find()->where(["id" => $id])->one();
    if(!empty($contacts)){
        return $contacts->first_name . " " . $contacts->last_name;
    }

    return null;
}    
    
}
