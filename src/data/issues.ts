// SWOT 类型定义
export type SwotType = 'strength' | 'weakness' | 'opportunity' | 'threat';

export interface SwotPoint {
  id: string;
  text: string;
  type: SwotType;
}

export interface DimensionWithSwot {
  id: string;
  title: string;
  points: SwotPoint[];
}

// 15个维度及其SWOT要点
export const dimensions: DimensionWithSwot[] = [
  {
    id: 'funding',
    title: '可持续资金平衡',
    points: [
      { id: 'funding-s1', text: '政府资金雄厚有保障，关键在于看到预期', type: 'strength' },
      { id: 'funding-w1', text: '北京土地财政有路径依赖，转变困难', type: 'weakness' },
      { id: 'funding-w2', text: '资金不足，经济压力较大', type: 'weakness' },
      { id: 'funding-w3', text: '地方政府的财政压力比较大', type: 'weakness' },
      { id: 'funding-w4', text: '财务持续有风险，需向市场和政府证明投资回报', type: 'weakness' },
      { id: 'funding-w5', text: '政府主导压力大，需避免主导投入给财政带来更大压力', type: 'weakness' },
      { id: 'funding-w6', text: '城市更新的商业模式不清晰，测算方法尚不明确', type: 'weakness' },
      { id: 'funding-w7', text: '居住类城市更新的资金平衡模式尚未跑通', type: 'weakness' },
      { id: 'funding-w8', text: '部分区政府债务压力尤为突出，制约更新投入的可持续性', type: 'weakness' },
      { id: 'funding-w9', text: '新发展模式下，政府财政紧张，财政投入能力持续受限', type: 'weakness' },
      { id: 'funding-t1', text: '资源有限转型难，支撑低碳化转型的条件受限', type: 'threat' },
    ],
  },
  {
    id: 'implementer',
    title: '实施主体',
    points: [
      { id: 'implementer-w1', text: '社会投资加入难，社会投资加入城市更新存在困难', type: 'weakness' },
      { id: 'implementer-w2', text: '市场主体能力不足，缺乏干活的主体', type: 'weakness' },
      { id: 'implementer-w3', text: '市场活力不足，城市更新中政府投资占比依然偏大', type: 'weakness' },
      { id: 'implementer-s1', text: '产权主体能升值，产权主体通过更新可实现物业价值升值', type: 'strength' },
      { id: 'implementer-o1', text: '转型重构新模式，处于转型期，可重构模式，建立新规则和制度', type: 'opportunity' },
      { id: 'implementer-o2', text: '企业也有意愿参与城市更新，打造标杆示范项目', type: 'opportunity' },
      { id: 'implementer-o3', text: '扩面整合资源，城市更新任务扩面，可整合更多资源和资产', type: 'opportunity' },
      { id: 'implementer-s2', text: '各方面专业知识储备充足，为更新工作提供了智力支持', type: 'strength' },
      { id: 'implementer-s3', text: '开发建设经验的积累，以及相关制造业的产能扩张和技术提升，也提供了坚实保障', type: 'strength' },
    ],
  },
  {
    id: 'unit',
    title: '城市更新实施单元生成',
    points: [
      { id: 'unit-s1', text: '政策体系基本构建，十四五期间，北京政策体系基本构建，顶层设计凝聚共识', type: 'strength' },
      { id: 'unit-s2', text: '平台公司降成本，各区有平台公司，可统一推进，减少交易成本', type: 'strength' },
      { id: 'unit-s3', text: '政府握有建设指标，可通过政策调整功能', type: 'strength' },
      { id: 'unit-s4', text: '专业重视政策多，各专业积极参与，全市政府高度重视，五年出台五六十条政策', type: 'strength' },
      { id: 'unit-s5', text: '拥有大量典型的城市更新项目案例，积累了丰富的实践经验', type: 'strength' },
      { id: 'unit-w1', text: '政策落地需保障，虽出台一系列政策，但后续保障政策有效落地和实施需研究', type: 'weakness' },
      { id: 'unit-w2', text: '区域综合性更新的统筹主体能力有待提升', type: 'weakness' },
      { id: 'unit-w3', text: '项目本身的实施推进也存在诸多阻力', type: 'weakness' },
      { id: 'unit-w4', text: '目标方向明确，但落地的具体路径和方法仍不清晰', type: 'weakness' },
    ],
  },
  {
    id: 'coordination',
    title: '跨部门协同机制',
    points: [
      { id: 'coordination-w1', text: '部门众多，行政处理环节冗余，审批发证环节存在较多冗余', type: 'weakness' },
      { id: 'coordination-s1', text: '京津冀协同突出，协同优势在北京较为突出', type: 'strength' },
      { id: 'coordination-s2', text: '资源数据整合强，规划院具备资源数据整合能力，可在平台上开展工作', type: 'strength' },
      { id: 'coordination-w2', text: '城市更新需要协调中央单位，难度很大', type: 'weakness' },
      { id: 'coordination-s3', text: '整体统筹力度大，交通主体单一，北京统筹力度强，首规委的作用有助于区域统筹', type: 'strength' },
      { id: 'coordination-w3', text: '部门协同合力弱，部门协同未形成合力，各自为政，存在资金重复投资浪费问题', type: 'weakness' },
      { id: 'coordination-s4', text: '城市更新的治理体系完善，自上而下的组织统筹与主导能力强', type: 'strength' },
      { id: 'coordination-w4', text: '行业壁垒影响协同，行业壁垒影响部门协同和创新发展', type: 'weakness' },
      { id: 'coordination-s5', text: '城市更新的整体组织能力突出', type: 'strength' },
      { id: 'coordination-w5', text: '对复杂大项目的落地和顺利推进造成了制度障碍', type: 'weakness' },
      { id: 'coordination-w6', text: '央地协同难度高，涉及央产问题，央地协同难度比其他城市高', type: 'weakness' },
      { id: 'coordination-s6', text: '政府动员能力强，想干的事能够推进', type: 'strength' },
      { id: 'coordination-s7', text: '政府执行力高，具有较强的责任担当和拉动力', type: 'strength' },
    ],
  },
  {
    id: 'property',
    title: '土地、房屋和空间权属结构',
    points: [
      { id: 'property-w1', text: '城市更新的土地和房屋产权比较复杂，人员情况多元', type: 'weakness' },
      { id: 'property-w2', text: '土地和空间的权属复杂，中央和地方的协同问题突出', type: 'weakness' },
      { id: 'property-w3', text: '权益主体参与难，权益主体参与决策和讨论缺乏机制，多被动等待', type: 'weakness' },
      { id: 'property-t1', text: '历史文化保护等因素造成了较大的建设和改造限制', type: 'threat' },
      { id: 'property-w4', text: '跨区更新所需建筑规模指标的腾挪存在困难', type: 'weakness' },
      { id: 'property-w5', text: '居民自主更新、自发投资改造的意识尚未有效建立', type: 'weakness' },
    ],
  },
  {
    id: 'interest',
    title: '多元利益平衡',
    points: [
      { id: 'interest-w1', text: '利益主体难平衡，城市更新中利益主体多，诉求不同，平衡各主体利益诉求存在挑战', type: 'weakness' },
      { id: 'interest-w2', text: '城市更新面临来自居民、社区、企业、政府、社会等多方的复杂诉求，协调难度大', type: 'weakness' },
      { id: 'interest-w3', text: '城中村改造等项目在推进期间对周边社会影响较大，舆情处理难度较高', type: 'weakness' },
      { id: 'interest-w4', text: '全民参与机制弱，公众参与机制和责任调度困难，机制较弱', type: 'weakness' },
      { id: 'interest-w5', text: '央国企利益协调难，央国企众多，各部门利益协调困难', type: 'weakness' },
      { id: 'interest-w6', text: '不同群体诉求难以平衡，人群差异化、诉求不同，难以平衡', type: 'weakness' },
    ],
  },
  {
    id: 'public',
    title: '公众参与度',
    points: [
      { id: 'public-s1', text: '居委会了解诉求，北京有强大的居民居委会，对辖区内不同利益主体的诉求了解清楚，可撬动更新意愿', type: 'strength' },
      { id: 'public-s2', text: '北京市民对于城市更新的参与意识正在逐渐提升', type: 'strength' },
      { id: 'public-w1', text: '共有意识不足，居民共享意识不足，如大院打开后设施利用存在问题', type: 'weakness' },
      { id: 'public-s3', text: '民众诉求强烈，尤其是居住改善意愿非常明显', type: 'strength' },
      { id: 'public-s4', text: '老旧小区有意愿，中心城区老旧小区多，有更新意愿', type: 'strength' },
      { id: 'public-o1', text: '人口和家庭结构的变化产生了新的城市更新需求和场景', type: 'opportunity' },
    ],
  },
  {
    id: 'market',
    title: '市场活力',
    points: [
      { id: 'market-w1', text: '市场开放动力不足，市场不够开放，缺乏社会资本和开放动力', type: 'weakness' },
      { id: 'market-o1', text: '城市更新已成为扩大内需的重要抓手', type: 'opportunity' },
      { id: 'market-o2', text: '高价值地区的价值洼地效应较为显著，存在挖潜空间', type: 'opportunity' },
      { id: 'market-w2', text: '市场营商环境存在较大问题，相比南方城市不具优势', type: 'weakness' },
      { id: 'market-o3', text: '低利率环境在资金和融资方面为城市更新带来了一定优势', type: 'opportunity' },
      { id: 'market-w3', text: '城市人才吸引力正在下降', type: 'weakness' },
      { id: 'market-w4', text: '相比二三线城市，北京的综合吸引力正在降低', type: 'weakness' },
      { id: 'market-w5', text: '经济周期内，市场主体普遍观望，对投资与项目信心不足', type: 'weakness' },
      { id: 'market-w6', text: '青年人口持续流出，疏解导致青年人口持续流出北京', type: 'weakness' },
      { id: 'market-w7', text: '市场预期待激发，房产中心偏好老旧小区改造，但难以激发实施主体动力', type: 'weakness' },
      { id: 'market-w8', text: '全民消费能力弱，全民消费能力和意愿不强', type: 'weakness' },
      { id: 'market-t1', text: '全国其他大都市圈对人才和企业的争夺也在持续升温', type: 'threat' },
      { id: 'market-o4', text: '更新类型多样，发展腹地大，市场增长潜力强', type: 'opportunity' },
      { id: 'market-w9', text: '经济转型压力较大', type: 'weakness' },
      { id: 'market-t2', text: '北京面临来自其他都市圈和城市的竞争，激烈程度不断加大', type: 'threat' },
    ],
  },
  {
    id: 'stock',
    title: '存量转型',
    points: [
      { id: 'stock-w1', text: '目前的城市更新政策仍以增量时代为基础，特别是规划和土地政策，导致实施中存在"更新不如新建"的困境', type: 'weakness' },
      { id: 'stock-w2', text: '需求量非常大，但高度分散，不容易形成亮点和单点突破', type: 'weakness' },
      { id: 'stock-w3', text: '在减量发展路径下，规模指标存在天花板，制约了更新的规模和方式', type: 'weakness' },
      { id: 'stock-o1', text: '增量受阻倒逼更新，增量模式推进受阻，反向倒逼存量更新', type: 'opportunity' },
      { id: 'stock-o2', text: '可更新设施多，北京建设较早，可更新的重大设施较多', type: 'opportunity' },
      { id: 'stock-o3', text: '城市发展战略从"摊大饼"回归中心城区，聚焦五环内的战略性收缩为内涵式更新带来了机遇', type: 'opportunity' },
      { id: 'stock-t1', text: '工程难题待解决，北京高层住宅更新和老城建设地铁快线等存在工程方面的挑战', type: 'threat' },
      { id: 'stock-w4', text: '减量约束和减量发展框架下，资源和建筑规模都面临指标天花板', type: 'weakness' },
    ],
  },
  {
    id: 'capital',
    title: '首都功能',
    points: [
      { id: 'capital-s1', text: '首都功能优势明显，北京作为首都，在文化历史、国际交往、首都功能等方面优势明显', type: 'strength' },
      { id: 'capital-s2', text: '首都资源禀赋优越，要素集聚能力强，具有很强的资源集聚性', type: 'strength' },
      { id: 'capital-t1', text: '首都功能对政治安全、文化保护和"四个中心"建设带来多重约束条件', type: 'threat' },
      { id: 'capital-o1', text: '"国际交往中心"建设为城市更新营造了开放包容的国际化环境和场景', type: 'opportunity' },
      { id: 'capital-t2', text: '政治中心建设、政治安全保障等特殊任务，给推动城市更新带来了额外约束和挑战', type: 'threat' },
    ],
  },
  {
    id: 'industry',
    title: '产业转型与新功能导入',
    points: [
      { id: 'industry-s1', text: '人口和就业岗位密度大，人才密度高，为城市更新提供了良好的基础', type: 'strength' },
      { id: 'industry-s2', text: '高校资源创新强，北京高校资源丰富，在创新方面有一定优势', type: 'strength' },
      { id: 'industry-s3', text: '科技研发和原始创新能力强', type: 'strength' },
      { id: 'industry-o1', text: 'AI 人工智能的发展为城市更新带来了新机遇', type: 'opportunity' },
      { id: 'industry-o2', text: '城市中不断涌现的新兴空间和新业态，特别是自下而上的创新，注入了新活力', type: 'opportunity' },
      { id: 'industry-o3', text: '承接转型新动能，房地产转型新模式可由城市中心承接，赋能新动能', type: 'opportunity' },
      { id: 'industry-o4', text: 'AI应用可落地，AI应用场景、智能制造、具身智能等发展，可通过城市更新落地应用', type: 'opportunity' },
      { id: 'industry-t1', text: 'AI 等技术变革对传统的城市更新做法和商业模式带来了新的冲击', type: 'threat' },
    ],
  },
  {
    id: 'quality',
    title: '以人为本的空间品质',
    points: [
      { id: 'quality-s1', text: '基础设施完善，轨道交通网络规模世界领先；具备完善的慢行系统物质基底，道路密度高', type: 'strength' },
      { id: 'quality-w1', text: '气候条件相比南方城市不够宜人', type: 'weakness' },
      { id: 'quality-w2', text: '北京是内陆城市，相对于海洋城市，对最新理念的接受和包容程度有所不足', type: 'weakness' },
      { id: 'quality-w3', text: '城市"摊大饼"现象严重，空间尺度太大，导致城市运行成本偏高', type: 'weakness' },
      { id: 'quality-w4', text: '房价高，交通、通勤、时间成本较高，城市整体可负担性弱', type: 'weakness' },
      { id: 'quality-w5', text: '城市色彩较低，公共空间和道路的尺度感过大', type: 'weakness' },
      { id: 'quality-o1', text: '目标转变促消费，目标导向转变为以人为中心，促进消费转型', type: 'opportunity' },
      { id: 'quality-o2', text: '带动城市面貌焕新，从车本位转向人本位，追求生态环境品质提升', type: 'opportunity' },
    ],
  },
  {
    id: 'green',
    title: '绿色转型',
    points: [
      { id: 'green-t1', text: '模式多样难度大，能源保障模式多样化，有集中、分散、壁挂等形式，增加了适用难度', type: 'threat' },
      { id: 'green-t2', text: '资源有限转型难，北京能源资源密度高但总量有限，支撑低碳化转型的条件受限', type: 'threat' },
      { id: 'green-t3', text: '城市体量差异大，与丹麦、德国等城市相比，北京城市体量大，供热等系统的模式难以照搬', type: 'threat' },
      { id: 'green-t4', text: '增量变量压力大，更新的增量和变量对环境与交通造成压力，需缓解或承担', type: 'threat' },
      { id: 'green-t5', text: '工程难题待解决，北京高层住宅更新和老城建设地铁快线等存在工程方面的挑战', type: 'threat' },
      { id: 'green-o1', text: '首都能级的跃升、绿色转型发展的窗口期，以及建设国际城市的发展导向，共同助力城市更新', type: 'opportunity' },
      { id: 'green-o2', text: '智慧城市相关技术和方法在城市更新中得到了广泛应用', type: 'opportunity' },
      { id: 'green-o3', text: '数字赋能为量化、科学、准确地确定更新目标及划定范围创造了条件', type: 'opportunity' },
    ],
  },
  {
    id: 'resource',
    title: '资源基础',
    points: [
      { id: 'resource-s1', text: '形成了巨量的优质公共资产，土地资源质量较高', type: 'strength' },
      { id: 'resource-s2', text: '资源禀赋丰富，北京有丰富的资源禀赋', type: 'strength' },
      { id: 'resource-s3', text: '存量资源底数大、底盘厚，可供选择的更新路径较多', type: 'strength' },
      { id: 'resource-s4', text: '用地资源更充足，疏解腾退非首都功能后，用地资源相对更充足', type: 'strength' },
      { id: 'resource-w1', text: '北京不同地区、区县之间区域差异非常大', type: 'weakness' },
      { id: 'resource-o1', text: '都市圈的协同发展为首都圈城市更新提供了空间支撑', type: 'opportunity' },
      { id: 'resource-s5', text: '城市更新的专业基础较好，相关领域基础研究深厚', type: 'strength' },
    ],
  },
  {
    id: 'policy',
    title: '政策环境',
    points: [
      { id: 'policy-o1', text: '国家层面高质量发展的政策支持', type: 'opportunity' },
      { id: 'policy-o2', text: '时机成熟，处于转型期，时机成熟', type: 'opportunity' },
      { id: 'policy-o3', text: '北京市疏解、腾退和提升的相关政策支持', type: 'opportunity' },
      { id: 'policy-s1', text: '中央对城市更新提出了明确要求，社会各界已凝聚起广泛共识', type: 'strength' },
      { id: 'policy-s2', text: '城市更新的制度体系比较完备，法定规划的覆盖度高', type: 'strength' },
      { id: 'policy-o4', text: '政策利好逐渐释放，中央和地方相关政策不断出台，投资力度持续加大', type: 'opportunity' },
      { id: 'policy-s3', text: '政策体系基本构建，十四五期间，北京政策体系基本构建，顶层设计凝聚共识', type: 'strength' },
      { id: 'policy-o5', text: '国家政策红利、鼓励试点与创新，为城市更新提供了重要契机', type: 'opportunity' },
      { id: 'policy-s4', text: '专业重视政策多，各专业积极参与，全市政府高度重视，五年出台五六十条政策', type: 'strength' },
      { id: 'policy-o6', text: '国家政策支持，城市更新背景下，国家政策提供支持', type: 'opportunity' },
      { id: 'policy-o7', text: '政府重视经济建设，十五时期政府回归经济建设中心，重视运营能力，政策环境好', type: 'opportunity' },
      { id: 'policy-w1', text: '政策惯性大，需要在规划和土地政策方面进行深度改革', type: 'weakness' },
      { id: 'policy-w2', text: '部分地方政府在城市更新方面的长远规划意识有待提升', type: 'weakness' },
      { id: 'policy-o8', text: '政策交替谋新篇，处于十四五和十五五交替期，可利用五年规划进行筹谋和规划', type: 'opportunity' },
      { id: 'policy-w3', text: '既有的工作方式和实施惯例对城市更新的创新与突破造成了不小的制约', type: 'weakness' },
      { id: 'policy-w4', text: '试点政策宽松度不足，推示范项目试点时，政策宽松度不够，如容错机制和点对点扶持不足', type: 'weakness' },
      { id: 'policy-t1', text: '城市更新面临较多的政策约束和审批限制', type: 'threat' },
      { id: 'policy-w5', text: '政策落地需保障，虽出台一系列政策，但后续保障政策有效落地和实施需研究', type: 'weakness' },
    ],
  },
];

export const MAX_VOTES = 5;

// SWOT 标签配置
export const swotConfig = {
  strength: {
    label: '优势',
    labelEn: 'S',
    color: 'bg-emerald-500',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
  },
  weakness: {
    label: '劣势',
    labelEn: 'W',
    color: 'bg-amber-400',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
  },
  opportunity: {
    label: '机遇',
    labelEn: 'O',
    color: 'bg-sky-400',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-700',
  },
  threat: {
    label: '挑战',
    labelEn: 'T',
    color: 'bg-rose-500',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-700',
  },
};
