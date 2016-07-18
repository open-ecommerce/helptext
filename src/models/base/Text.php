<?php
// This class was automatically generated by a giiant build task
// You should not change it manually as it will be overwritten on next build

namespace app\models\base;

use Yii;

/**
 * This is the base-model class for table "text".
 *
 * @property integer $id
 * @property integer $id_phone
 * @property integer $id_case
 * @property integer $id_sender_type
 * @property string $message
 * @property string $sent
 * @property string $aliasModel
 */
abstract class Text extends \yii\db\ActiveRecord
{



    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'text';
    }


    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id_phone', 'id_case', 'id_sender_type'], 'integer'],
            [['sent'], 'safe'],
            [['message'], 'string', 'max' => 50]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'id_phone' => Yii::t('app', 'Id Phone'),
            'id_case' => Yii::t('app', 'Id Case'),
            'id_sender_type' => Yii::t('app', 'Id Sender Type'),
            'message' => Yii::t('app', 'Message'),
            'sent' => Yii::t('app', 'Sent'),
        ];
    }


    
    /**
     * @inheritdoc
     * @return TextQuery the active query used by this AR class.
     */
//    public static function find()
//    {
//        return new app\models\search\TextQuery(get_called_class());
//    }
    
    
    /**
     * @return \yii\db\ActiveQuery
     */
    public function getCase()
    {
        return $this->hasOne(\app\models\Contact::className(), ['id' => 'id_case']);
    }    


    
    
}
