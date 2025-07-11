---
title: JavaScript设计模式读书笔记(1)
date: 2022-08-20 14:47:46
cover: https://cdn.pixabay.com/photo/2023/01/21/13/40/trees-7733878_640.jpg
tags:
---

#### 面向对象
一、面向过程与面向对象
面向对象编程就是将你的需求抽象成一个对象，然后针对这个对象分析其特征（属性)与动作（方法)。这个对象我们称之为类。面向对象编程思想其中有一个特点就是封装，就是说把你需要的功能放在一个对象里
二、封装
1、使用原型(prototype)为类添加属性和方法的两种方式(**注意两种不能混用**)：
(1)为原型对象属性赋值

<!-- more -->

```javascript
Book.prototype.display = function() {
  // ....
}
```
(2)将一个对象赋值给类的原型对象
```javascript
Book.prototype = {
  display = function() {}
}
```

2、使用this和原型(prototype)为类添加属性和方法的区别：
(1)使用this添加的属性和方法是在当前对象上添加的，每次通过类创建新对象时，this指向的属性和方法都会得到相应的创建
(2)通过prototype继承的属性和方法是每个对象通过prototype访问到的，新创建对象时，不会再新创建属性和方法

3、constructor是什么？
constructor是一个属性，当创建一个函数或者对象时都会为其创建一个原型对象prototype，在 prototype对象中又会像函数中创建 this一样创建一个constructor属性，那么constructor属性指向的就是拥有整个原型对象的函数或对象。
{% asset_img prototype.png prototype %}

4、属性与方法的封装
(1)私有属性与私有方法
由于JavaScript的函数级作用域，声明在函数内部的变量以及方法在外界是访问不到的,通过此特性创建类的私有变量以及私有方法
(2)共有属性和共有方法
在函数内部通过 this创建的属性和方法，在类创建对象时，每个对象自身都拥有一份并且可以在外部访问到。因此通过this创建的属性可看作是对象共有属性和对象共有方法
(3)特权方法(类的构造器)
通过this创建的方法，不但可以访问这些对象的共有属性与共有方法，而且还能访问到类（创建时）或对象自身的私有属性和私有方法，由于这些方法权利比较大，所以我们又将它看作特权方法。在对象创建时通过使用这些特权方法我们可以初始化实例对象的一些属性,因此这些在创建对象时调用的特权方法还可以看作是类的构造器
{% asset_img public-and-private.png public-and-private %}

5、在类的外部通过点语法定义的属性和方法以及在外部通过 prototype定义的属性和方法作用
(1)类的外部通过点语法定义的属性和方法：通过new关键字创建新对象时，由于类外面通过点语法添加的属性和方法没有执行到,所以新创建的对象中无法获取他们，但是可以通过类来使用。因此在类外面通过点语法定义的属性以及方法被称为类的静态共有属性和类的静态共有方法
(2)外部通过 prototype定义的属性和方法: 类通过prototype创建的属性或者方法在类实例的对象中是可以通过 this访问到的，所以我们将prototype对象中的属性和方法称为共有属性和共有方法
{% asset_img static-and-public.png static-and-public %}
通过new关键字创建的对象实质是对新对象 this 的不断赋值，并将prototype指向类的prototype所指向的对象，而类的构造函数外面通过点语法定义的属性方法是不会添加到新创建的对象上去的。因此要想在新创建的对象中使用 isChinese就得通过Book类使用而不能通过this，如 Book.isChinese，而类的原型 prototype 上定义的属性在新对象里就可以直接使用，这是因为新对象的prototype和类的prototype指向的是同一个对象。

6、闭包
闭包是有权访问另外一个函数作用域中变量的函数，即在一个函数内部创建另外一个函数。我们将这个闭包作为创建对象的构造函数，这样它既是闭包又是可实例对象的函数，即可访问到类函数作用域中的变量

7、创建对象的安全模式
new关键字的作用可以看作是对当前对象的this不停地赋值,没有用new，所以就会直接执行函数，而函数在全局作用域中执行所以在全局作用域中 this指向的当前对象自然就是全局变量
{% asset_img safe-model.png safe-model %}

三、继承
1、子类的原型对象 - 类式继承
{% asset_img class-inherit.png class-inherit %}
声明2个类而已，类式继承需要将第一个类的实例赋值给第二个类的原型
类的原型对象的作用就是为类的原型添加共有方法,但类不能直接访问这些属性和方法,必须通过原型prototype来访问。而我们实例化一个父类的时候，新创建的对象复制了父类的构造函数内的属性与方法并且将原型_proto_指向了父类的原型对象，这样就拥有了父类的原型对象上的属性与方法，并且这个新创建的对象可直接访问到父类原型对象上的属性与方法。如果我们将这个新创建的对象赋值给子类的原型，那么子类的原型就可以访问到父类的原型属性和方法。
新创建的对象不仅仅可以访问父类原型上的属性和方法，同样也可访问从父类构造函数中复制的属性和方法。将这个对象赋值给子类的原型,那么这个子类的原型同样可以访问父类原型上的属性和方法与从父类构造函数中复制的属性和方法。这是类式继承的原理

(1)可以使用instanceof来检测某个对象是否是某个类的实例，或者说某个对象是否继承了某个类
注意：instanceof是通过判断对象的 prototype链来确定这个对象是否是某个类的实例，而不关心对象与类的自身结构
**instanceof是判断前面的对象是否是后面类(对象)的实例，它并不表示两者的继承，在实现上面的 subClass 继承superClass时是通过将 superClass的实例赋值给subClass 的原型prototype，所以说SubClass.prototype继承了superClass**

(2)类式继承的缺点
其一：由于子类通过其原型prototype对父类实例化，继承了父类。所以说父类中的共有属性要是引用类型，就会在子类中被所有实例共用,因此一个子类的实例更改子类原型从父类构造函数中继承来的共有属性就会直接影响到其他子类
其二：由于子类实现的继承是靠其原型prototype对父类的实例化实现的，因此在创建父类的时候，是无法向父类传递参数的,因而在实例化父类的时候也无法对父类构造函数内的属性进行初始化

2、创建即继承 - 构造函数继承
{% asset_img constructor-inherit.png constructor-inherit %}
SuperClass.call(this，id);这条语句是构造函数式继承的精华，由于 call这个方法可以更改函数的作用环境，因此在子类中，对superClass调用这个方法就是将子类中的变量在父类中执行一遍，由于父类中是给this绑定属性的，因此子类自然也就继承了父类的共有属性。由于这种类型的继承没有涉及原型prototype，所以父类的原型方法自然不会被子类继承，而如果要想被子类继承就必须要放在构造函数中，这样创建出来的每个实例都会单独拥有一份而不能共用，这样就违背了代码复用的原则

3、将优点为我所用 - 组合继承
(1)类式继承是通过子类的原型prototype对父类实例化来实现的,构造函数式继承是通过在子类的构造函数作用环境中执行一次父类的构造函数来实现的
{% asset_img combination-inherit.png combination-inherit %}
在子类构造函数中执行父类构造函数，在子类原型上实例化父类就是组合模式
(2)缺点
在使用构造函数继承时执行了一遍父类的构造函数，而在实现子类原型的类式继承时又调用了一遍父类构造函数。因此父类构造函数调用了两遍

4、洁净的继承者 - 原型式继承
{% asset_img prototype-inherit.png prototype-inherit %}
对类式继承的一个封装，其实其中的过渡对象就相当于类式继承中的子类，只不过在原型式中作为一个过渡对象出现的，目的是为了创建要返回的新的实例化对象
{% asset_img test-prototype-inherit.png test-prototype-inherit %}

5、如虎添翼 - 寄生式继承
{% asset_img parasitic-inherit.png parasitic-inherit %}
寄生式继承就是对原型继承的第二次封装，并且在这第二次封装过程中对继承的对象进行了拓展,这样新创建的对象不仅仅有父类中的属性和方法而且还添加新的属性和方法

6、终极继承者 - 寄生组合式继承
寄生式继承和构造函数继承

寄生式继承的改造
{% asset_img parasitic-inherit-change.png parasitic-inherit-change %}

{% asset_img parasitic-combination-inherit.png parasitic-combination-inherit %}

{% asset_img how-to-inherit.png how-to-inherit %}

**子类再想添加原型方法必须通过 prototype.对象，通过点语法的形式一个一个添加方法了，否则直接赋予对象就会覆盖掉从父类原型继承的对象**

四、多继承
单继承(extend)：对对象中的属性的一个浅复制过程，只能复制值类型的属性，无法复制引用类型属性
{% asset_img multiple-inherit.png multiple-inherit %}

五、多态
同一个方法多种调用方式
{% asset_img multiple-status.png multiple-status %}