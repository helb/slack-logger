q = document.querySelector.bind(document);
qa = document.querySelectorAll.bind(document);

/** Allows to use forEach on NodeLists like this:
 *
 *  qa("tbody.messages tr").forEach(function(el){
 *      console.log(el.dataset['id']);
 *  });
 *
 * forEach parameters are the same as for Array.forEach:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
*/
NodeList.prototype.forEach = Array.prototype.forEach;

/** Same thing for Gecko. See https://bugzilla.mozilla.org/show_bug.cgi?id=14869 */
HTMLCollection.prototype.forEach = Array.prototype.forEach;
