<?php
// This class was automatically generated by a giiant build task
// You should not change it manually as it will be overwritten on next build

namespace app\models\base;

use Yii;

/**
 * This is the base-model class for table "outcome_category".
 *
 * @property integer $id
 * @property string $outcome
 * @property string $aliasModel
 */
abstract class OutcomeCategory extends \yii\db\ActiveRecord
{



    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'outcome_category';
    }


    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['outcome'], 'string', 'max' => 50]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'outcome' => Yii::t('app', 'Outcome Category'),
        ];
    }




}
