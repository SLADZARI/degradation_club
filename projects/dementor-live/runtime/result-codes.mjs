// I18N-01 Dev1: additive HTTP metadata for existing server action results.
// Treat saved player.results / pagerReceipts as immutable receipts. Never infer
// identity from the new request type: a repeated requestId can carry another type.
const CODE_PATTERN=/^[a-z][a-z0-9]*(?:\.[a-z][a-z0-9]*)+$/;
const ERROR_CODES=new Map([
  ['Войди в мир заново','error.auth.rejoin'],
  ['Открой игру по адресу этого сервера','error.auth.origin'],
  ['Метод не поддерживается','error.http.methodNotAllowed'],
  ['Нет такого действия','error.action.unknown'],
  ['Неизвестное действие','error.action.unknown'],
  ['Нет идентификатора действия','error.action.missingRequestId'],
  ['Требуется requestId','error.action.missingRequestId'],
  ['Нет подключения к миру','error.connection.offline'],
  ['Подойди ближе к объекту','error.action.outOfRange'],
  ['В рюкзаке нет места','error.inventory.full'],
  ['Нет места в рюкзаке','error.inventory.full'],
  ['Рюкзак полон — отнеси материалы на площадь','error.inventory.full'],
  ['Недостаточно PAPER','error.economy.insufficientPaper'],
  ['Не хватает PAPER','error.economy.insufficientPaper'],
  ['Участок уже куплен','error.plot.owned'],
  ['Нет нужных материалов: проверь потребность площади','error.project.noMaterials'],
  ['Свободный бюджет приёмки исчерпан','error.economy.noBudget'],
  ['Городской резерв исчерпан','error.economy.noBudget'],
  ['Житель не найден','error.player.notFound'],
  ['Номер не найден или ещё не открыт','error.telecom.numberUnavailable'],
  ['Абонент недоступен','error.telecom.unavailable'],
  ['Тестовая казна отключена: нужны HTTPS и серверный ключ','error.admin.disabled'],
  ['Нет полномочий казначея','error.admin.forbidden']
]);
const SUCCESS_CODES=new Map([
  ['Сообщение отправлено','action.chat.sent'],
  ['Ты снова полон сил','action.food.eaten'],
  ['Стартовые инструменты выданы. Улучшенные сохранены без бесплатного ремонта.','action.tools.provided'],
  ['Топор в руках','action.equipment.axe'],
  ['Кирка в руках','action.equipment.pick'],
  ['Действие остановлено','action.cancelled'],
  ['Твоё место в городе. Участок куплен!','action.plot.purchased'],
  ['Заказ взят. Забери городской груз на складе в течение 5 минут.','action.courier.accepted'],
  ['Заказ отменён. Городской груз остаётся на складе.','action.courier.cancelled'],
  ['Пейджерное сообщение отправлено · −1 PAPER','action.pager.sent'],
  ['Сообщение прочитано','action.pager.read'],
  ['Работаем…','action.build.started'],
  ['Добываем…','action.mine.started'],
  ['Собираем…','action.gather.started'],
  ['Этот трек уже есть в автомате','action.music.alreadyExists'],
  ['MP3 добавлен в музыкальный автомат','action.music.added']
]);

// Primitive-only, explicitly allowlisted values. No nested objects, arbitrary
// user-generated text or untrusted request fields enter translation parameters.
function safeParams(value){
  const result={};
  if(!value||typeof value!=='object'||Array.isArray(value))return result;
  for(const key of ['quantity','reward','price']){
    if(Number.isSafeInteger(value[key])&&value[key]>=0)result[key]=value[key];
  }
  if(value.currency==='PAPER')result.currency='PAPER';
  if(typeof value.cityName==='string'&&value.cityName.length<=36)result.cityName=value.cityName;
  return result;
}
function checkedInteger(value){
  const n=Number(value);
  return Number.isSafeInteger(n)&&n>=0?n:null;
}
// Compatibility ONLY: derive legacy receipt metadata from the original,
// authoritative *saved result*, never from a new requestId/type/body.
function legacySuccess(result){
  const message=result.message;
  if(typeof message!=='string'){
    if(typeof result.sessionId==='string')return {code:'combat.session.ready',params:{}};
    if(Number.isSafeInteger(result.ammo)&&Number.isSafeInteger(result.shopRemaining))
      return {code:'combat.ammo.purchased',params:{}};
    return null;
  }
  let match;
  if((match=/^Склад принял (\d+) · \+(\d+) PAPER$/.exec(message))){
    const quantity=checkedInteger(match[1]),reward=checkedInteger(match[2]);
    if(quantity!==null&&reward!==null&&reward===result.reward)
      return {code:'action.warehouse.deposit',params:{quantity,reward}};
  }
  if((match=/^Принято (\d+) · \+(\d+) PAPER$/.exec(message))){
    const quantity=checkedInteger(match[1]),reward=checkedInteger(match[2]);
    if(quantity!==null&&reward!==null&&reward===result.reward)
      return {code:'action.project.deliver',params:{quantity,reward}};
  }
  if((match=/^Выложено на землю: (\d+)\. Любой житель может подобрать\.$/.exec(message))){
    const quantity=checkedInteger(match[1]);if(quantity!==null)
      return {code:'action.inventory.drop',params:{quantity}};
  }
  if((match=/^Подобрано: (\d+)$/.exec(message))){
    const quantity=checkedInteger(match[1]);if(quantity!==null)
      return {code:'action.inventory.pickup',params:{quantity}};
  }
  if((match=/^Доставка принята · \+(\d+) PAPER$/.exec(message))){
    const reward=checkedInteger(match[1]);if(reward!==null&&reward===result.reward)
      return {code:'action.courier.delivered',params:{reward}};
  }
  if((match=/^Добро пожаловать в (.{1,36})$/.exec(message)))
    return {code:'world.city.arrived',params:{cityName:match[1]}};
  if((match=/^Пейджер куплен\. Номер: \d{6}$/.exec(message)))
    return {code:'action.pager.purchased',params:{}};
  const code=SUCCESS_CODES.get(message);
  if(code)return {code,params:{}};
  return null;
}
function legacyError(result){
  const message=result.message;
  if(typeof message!=='string')return null;
  if(ERROR_CODES.has(message))return ERROR_CODES.get(message);
  if(/^Участок стоит \d+ PAPER$/.test(message)||/^Нужно \d+ PAPER$/.test(message))
    return 'error.economy.insufficientPaper';
  return null;
}
export function withActionCode(result){
  if(!result||typeof result!=='object'||Array.isArray(result)||typeof result.ok!=='boolean')return result;
  const ownCode=typeof result.code==='string'&&CODE_PATTERN.test(result.code)&&result.code.length<=96;
  const legacy=result.ok?legacySuccess(result):null;
  const code=ownCode?result.code:result.ok?(legacy?.code||'action.completed'):(legacyError(result)||'error.generic');
  const params=safeParams(ownCode?result.params:(legacy?.params||{}));
  if(result.ok&&Number.isSafeInteger(result.reward)&&result.reward>=0&&params.reward===undefined)
    params.reward=result.reward;
  return {...result,code,params};
}
export function withHttpCode(result,status){
  if(!result||typeof result!=='object'||Array.isArray(result)||typeof result.ok!=='boolean')return result;
  if(result.ok&&typeof result.message!=='string'&&typeof result.code!=='string')return result;
  const coded=withActionCode(result);
  if(result.ok||typeof result.code==='string'||legacyError(result))return coded;
  const fallback={401:'error.auth.rejoin',403:'error.http.forbidden',404:'error.http.notFound',405:'error.http.methodNotAllowed',413:'error.http.tooLarge'};
  return {...coded,code:fallback[status]||coded.code};
}
