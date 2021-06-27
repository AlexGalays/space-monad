import {OneMany, One, Many} from "../src/onemany";
import {Err, Ok, Result} from "../lib";

describe('onemany', () => {
    describe('Type checking', () => {
        test('An One can be assigned to any OneMany with a compatible One type', () => {
            const result: OneMany<number, number[]> = One(10);

            function getOne(): OneMany<number, number[]> {
                return  One(10);
            }
        });
        test('A Many can be assigned to any OneMany with a compatible Many type', () => {
            const result: OneMany<number, number[]> = Many([10, 20, 30]);

            function getOne(): OneMany<number, number[]> {
                return Many([10, 20, 30]);
            }
        })
    });
    describe('isOne', () => {
        test('One.isOne', () => {
            const one = One(10);
            expect(one.isOne() && one.get() === 10).toBe(true)
        });

        test('Many.isOne', () => {
            const many = Many([10, 20, 30]);
            expect(many.isOne()).toBe(false);
            expect(many.get()).toEqual([10, 20, 30]);
        });
    });
    describe('map', () => {
        test('One.map', () => {
            const one = One(10).map(x => x * 2)
            expect(one.type).toEqual('one');
            expect(one.get()).toEqual(20);
        })

        test('Many.map', () => {
            const many = Many([10, 20, 30]);
            expect(many.type).toEqual('many');
            expect(many.get()).toEqual([10, 20, 30]);
        })
    });
    describe('mapMany', () => {
        test('One.mapMany', () => {
            const one = One(10).mapMany(x => x * 2)
            expect(one.type).toEqual('one');
            expect(one.get()).toEqual(10);
        })

        test('Many.mapMany', () => {
            const many1 = Many([10, 20, 30]);
            expect(many1.type).toEqual('many');
            expect(many1.get()).toEqual([10, 20, 30]);
            const many2 = many1.mapMany(x => x.map(y => y*2)); // note that the CB function must return an array!
            expect(many2.type).toEqual('many');
            expect(many2.get()).toEqual([20, 40, 60]);
        })
    });
    describe('flatMapOne', () => {
        test('One.flatMapOne', () => {
            const one = One(10).flatMapOne(x => One(String(x * 2)))
            expect(one.type).toEqual('one');
            expect(one.get()).toEqual('20');
        })
        test('Many.flatMapOne', () => {
            const one = Many([20, 40, 60]).flatMapOne(x => Many([1,2,4]));
            expect(one.type).toEqual('many');
            expect(one.get()).toEqual([20, 40, 60]);
        })
    })
    describe('flatMapMany', () => {
        test('One.flatMapMany', () => {
            const one = One(10).flatMapMany(x => One(String(x * 2)))
            expect(one.type).toEqual('one');
            expect(one.get()).toEqual(10);
        })
        test('Many.flatMapMany', () => {
            const one = Many([20, 40, 60]).flatMapMany(x => Many([1,2,4]));
            expect(one.type).toEqual('many');
            expect(one.get()).toEqual([1, 2, 4]);
        })
    });
    describe('fold', () => {
        test('One.fold', () => {
            const one = One(10).fold(
                err => 'many',
                val => 'one'
            )
            expect(one).toBe('one');
        })
        test('Many.fold', () => {
            const many = Many([10, 20, 30]).fold(
                err => 'many',
                val => 'one'
            )
            expect(many).toBe('many');
        })
    });
    describe('toString', () => {
        test('One.toString', () => {
            expect(One(10).toString()).toEqual("One(10)");
        });
        test('Many.toString', () => {
            expect(Many([10, 20, 30]).toString()).toEqual("Many([10,20,30])");
        });
    });
})