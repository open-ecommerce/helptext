<?php

namespace app\models;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use app\models\Text;

/**
* TextSearch represents the model behind the search form about `app\models\Text`.
*/
class TextSearch extends Text
{
/**
* @inheritdoc
*/
public function rules()
{
return [
[['id', 'id_phone', 'id_case', 'id_sender_type'], 'integer'],
            [['message', 'sent'], 'safe'],
];
}

/**
* @inheritdoc
*/
public function scenarios()
{
// bypass scenarios() implementation in the parent class
return Model::scenarios();
}

/**
* Creates data provider instance with search query applied
*
* @param array $params
*
* @return ActiveDataProvider
*/
public function search($params)
{
$query = Text::find();

$dataProvider = new ActiveDataProvider([
'query' => $query,
]);

$this->load($params);

if (!$this->validate()) {
// uncomment the following line if you do not want to any records when validation fails
// $query->where('0=1');
return $dataProvider;
}

$query->andFilterWhere([
            'id' => $this->id,
            'id_phone' => $this->id_phone,
            'id_case' => $this->id_case,
            'id_sender_type' => $this->id_sender_type,
            'sent' => $this->sent,
        ]);

        $query->andFilterWhere(['like', 'message', $this->message]);

return $dataProvider;
}
}