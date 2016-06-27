<?php

namespace app\models;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use app\models\Severity;

/**
* SeveritySearch represents the model behind the search form about `app\models\Severity`.
*/
class SeveritySearch extends Severity
{
/**
* @inheritdoc
*/
public function rules()
{
return [
[['id'], 'integer'],
            [['severity', 'sla'], 'safe'],
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
$query = Severity::find();

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
        ]);

        $query->andFilterWhere(['like', 'severity', $this->severity])
            ->andFilterWhere(['like', 'sla', $this->sla]);

return $dataProvider;
}
}