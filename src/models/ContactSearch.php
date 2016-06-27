<?php

namespace app\models;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use app\models\Contact;

/**
* ContactSearch represents the model behind the search form about `app\models\Contact`.
*/
class ContactSearch extends Contact
{
/**
* @inheritdoc
*/
public function rules()
{
return [
[['id', 'id_country', 'id_language'], 'integer'],
            [['contact_label', 'first_name', 'last_name', 'gender', 'marital_status', 'birthday', 'address_line1', 'address_line2', 'city', 'state', 'postal_code', 'comments'], 'safe'],
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
$query = Contact::find();

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
            'id_country' => $this->id_country,
            'id_language' => $this->id_language,
            'birthday' => $this->birthday,
        ]);

        $query->andFilterWhere(['like', 'contact_label', $this->contact_label])
            ->andFilterWhere(['like', 'first_name', $this->first_name])
            ->andFilterWhere(['like', 'last_name', $this->last_name])
            ->andFilterWhere(['like', 'gender', $this->gender])
            ->andFilterWhere(['like', 'marital_status', $this->marital_status])
            ->andFilterWhere(['like', 'address_line1', $this->address_line1])
            ->andFilterWhere(['like', 'address_line2', $this->address_line2])
            ->andFilterWhere(['like', 'city', $this->city])
            ->andFilterWhere(['like', 'state', $this->state])
            ->andFilterWhere(['like', 'postal_code', $this->postal_code])
            ->andFilterWhere(['like', 'comments', $this->comments]);

return $dataProvider;
}
}