<?php
// This class was automatically generated by a giiant build task
// You should not change it manually as it will be overwritten on next build

namespace app\models\base;

use Yii;

/**
 * This is the base-model class for table "case_category".
 *
 * @property integer $id
 * @property string $case_category
 * @property string $aliasModel
 */
abstract class CaseCategory extends \yii\db\ActiveRecord
{



    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'case_category';
    }


    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['case_category'], 'required'],
            [['case_category'], 'string', 'max' => 50]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'case_category' => Yii::t('app', 'Case Category'),
        ];
    }



}
