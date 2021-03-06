<?php
// This class was automatically generated by a giiant build task
// You should not change it manually as it will be overwritten on next build

namespace app\models\base;

use Yii;

/**
 * This is the base-model class for table "phone".
 *
 * @property integer $id
 * @property string $comment
 * @property string $aliasModel
 */
abstract class Phone extends \yii\db\ActiveRecord
{



    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'phone';
    }


    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id'], 'required'],
            [['id'], 'integer'],
            [['comment'], 'string', 'max' => 200]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'comment' => Yii::t('app', 'Comment'),
        ];
    }


    
    /**
     * @inheritdoc
     * @return PhoneQuery the active query used by this AR class.
     */
    public static function find()
    {
        return new \app\models\PhoneQuery(get_called_class());
    }


}
