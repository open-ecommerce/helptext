<?php

namespace app\models;

/**
 * This is the ActiveQuery class for [[Languages]].
 *
 * @see Languages
 */
class LanguagesQuery extends \yii\db\ActiveQuery
{
    /*public function active()
    {
        $this->andWhere('[[status]]=1');
        return $this;
    }*/

    /**
     * @inheritdoc
     * @return Languages[]|array
     */
    public function all($db = null)
    {
        return parent::all($db);
    }

    /**
     * @inheritdoc
     * @return Languages|array|null
     */
    public function one($db = null)
    {
        return parent::one($db);
    }
}
