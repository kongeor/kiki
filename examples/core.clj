(def map
  (fn [f coll]
    (do
        (println "*" coll)
    (if (nil? coll)
      nil
      (cons (f (car coll)) (map f (cdr coll)))))))

(def add
  (fn [x y]
    (+ x y)))

(def fact 
  (fn [n]
    (if (= n 0)
      1
      (* n (fact (dec n))))))