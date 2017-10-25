package com.linkcld.toms.common.cache.utils;

import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheException;
import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Element;
import org.apache.log4j.Logger;

import java.io.Serializable;
import java.util.*;


/**
 * @ClassName: EhcacheUtil
 * @Description: 操作ehcache缓存的工具类，使用单例模式完成
 * @Encode:UTF-8
 * @author 石良洲
 * @date 2014-8-22 下午2:54:46
 * @version V1.0
 */

public class EhcacheUtil {
	private CacheManager manager;
	// private static EhcacheUtil instance;
	private static Logger log = Logger.getLogger(EhcacheUtil.class);

	public EhcacheUtil(String filePath) {
		// manager = CacheManager.create(EhcacheUtil.class.getClassLoader()
		// .getResourceAsStream("cds/ehcache.xml"));
		manager = CacheManager.create(EhcacheUtil.class.getClassLoader()
				.getResourceAsStream(filePath));
	}

	/**
	 * @Method: getCache
	 * @Description: 根据缓存名获取缓存
	 * @modifyBy:
	 * @modifyDate:
	 * @param cacheName
	 *            缓存名
	 * @return
	 * @throws
	 */
	public Cache getCache(String cacheName) {
		return manager.getCache(cacheName);
	}

	// /**
	// * @Method: getInstance
	// * @Description: 获取缓存工具的实例
	// * @modifyBy:
	// * @modifyDate:
	// * @return
	// * @throws
	// */
	// public synchronized static EhcacheUtil getInstance() {
	// log.debug("[EhcacheUtil.init]");
	// System.setProperty("net.sf.ehcache.enableShutdownHook", "true");
	// if (instance == null) {
	// instance = new EhcacheUtil();
	// }
	// return instance;
	// }

	/**
	 * @Method: isNull
	 * @Description: 判断一个元素是否为空
	 * @modifyBy:
	 * @modifyDate:
	 * @param e
	 *            缓存元素
	 * @return
	 * @throws
	 */
	private boolean isNull(Element e) {
		return e == null || e.getObjectValue() == null || e.getValue() == null;
	}

	/**
	 * @Method: put
	 * @Description: 往指定缓存存入一对键值
	 * @modifyBy:
	 * @modifyDate:
	 * @param cache
	 *            缓存库
	 * @param key
	 *            键
	 * @param value
	 *            值
	 * @throws
	 */
	public <T> void put(Cache cache, String key, T value) {
		if (cache != null) {
			Element e = new Element(key, value);
			cache.put(e);
			//cache.flush();
		}
	}

	/**
	 * @Method: put
	 * @Description: 存入 并设置元素是否永恒保存
	 * @modifyBy:
	 * @modifyDate:
	 * @param cache
	 *            缓存库
	 * @param key
	 *            键
	 * @param value
	 *            值
	 * @param eternal
	 *            是否永恒保存
	 * @throws
	 */
	public <T extends Serializable> void put(Cache cache, String key, T value,
			boolean eternal) {
		if (cache != null) {
			Element element = new Element(key, value);
			element.setEternal(eternal);
			cache.put(element);
			cache.flush();
		}
	}

	/**
	 * @Method: put
	 * @Description: 存入
	 * @modifyBy:
	 * @modifyDate:
	 * @param cache
	 *            缓存库
	 * @param key
	 *            键
	 * @param value
	 *            值
	 * @param timeToLiveSeconds
	 *            最大存活时间
	 * @param timeToIdleSeconds
	 *            最大访问间隔时间
	 * @throws
	 */
	public <T extends Serializable> void put(Cache cache, String key, T value,
			int timeToLiveSeconds, int timeToIdleSeconds) {
		if (cache != null) {
			Element element = new Element(key, value);
			element.setTimeToLive(timeToLiveSeconds);
			element.setTimeToIdle(timeToIdleSeconds);
			cache.put(element);
			cache.flush();
		}
	}

	/**
	 * @Method: getCacheElement
	 * @Description: 从指定缓存中获取指定键的缓存元素
	 * @modifyBy:
	 * @modifyDate:
	 * @param cache
	 *            缓存
	 * @param key
	 *            键
	 * @return
	 * @throws
	 */
	public Object getCacheElement(Cache cache, String key) {
		if (cache != null) {
			Element element = cache.get(key);
			return element;
		}
		return null;
	}

	/**
	 * @Method: get
	 * @Description: 从指定缓存中获取指定键的缓存的值
	 * @modifyBy:
	 * @modifyDate:
	 * @param cache
	 *            缓存
	 * @param key
	 *            键
	 * @return
	 * @throws
	 */
	public Object get(Cache cache, String key) {
		if (cache != null) {
			Element element = cache.get(key);
			return element.getObjectValue();
		}
		return null;
	}

	/**
	 * @Method: remove
	 * @Description: 从指定缓存中移除指定键的缓存的元素
	 * @modifyBy:
	 * @modifyDate:
	 * @param cache
	 *            缓存
	 * @param key
	 *            键
	 * @throws
	 */
	public void remove(Cache cache, String key) {
		if (cache != null) {
			cache.remove(key);
		}
	}

	/**
	 * @Method: removeAll
	 * @Description: 从指定缓存中移除指定键的缓存的元素
	 * @modifyBy:刘希望
	 * @modifyDate:2013-8-22
	 * @param cache
	 *            缓存
	 * @param keys
	 *            一组键
	 * @throws
	 */
	public void removeAll(Cache cache, Collection<String> keys) {
		if (cache != null) {
			cache.removeAll(keys);
		}
	}

	/**
	 * @Method: addToList
	 * @Description: 把值存入到给定缓存给定键的一个数组中
	 * @modifyBy:刘希望
	 * @modifyDate:2013-8-22
	 * @param cache
	 *            缓存
	 * @param key
	 *            键
	 * @param value
	 *            值
	 * @throws
	 */
	public void addToList(Cache cache, String key, Serializable value) {
		if (cache == null) {
			throw new CacheException("cache不存在");
		}
		Element e = cache.get(key);
		if (isNull(e)) {
			List<Serializable> list = Collections
					.synchronizedList(new LinkedList<Serializable>());
			list.add(value);
			e = new Element(key, list);
			e.setEternal(true);
			cache.put(e);
		} else {
			List<Serializable> list = (List<Serializable>) e.getObjectValue();
			list.add(value);
			e = new Element(key, list);
			e.setEternal(true);
			cache.put(e);
		}

		cache.flush();
	}

	/**
	 * @Method: addAllToList
	 * @Description: 把一组值存入到给定缓存给定键的一个数组中
	 * @modifyBy:刘希望
	 * @modifyDate:2013-8-22
	 * @param cache
	 * @param key
	 * @param value
	 * @throws
	 */
	public void addAllToList(Cache cache, String key,
			Collection<? extends Serializable> value) {
		if (cache == null) {
			throw new CacheException("cache不存在");
		}
		Element e = cache.get(key);
		if (isNull(e)) {
			List<Serializable> list = Collections
					.synchronizedList(new LinkedList<Serializable>());
			list.addAll(value);
			e = new Element(key, list);
			e.setEternal(true);
			cache.put(e);
		} else {
			List<Serializable> list = (List<Serializable>) e.getObjectValue();
			list.addAll(value);
			log.debug(key + "--" + list);
			e = new Element(key, list);
			e.setEternal(true);
			cache.put(e);
		}

		cache.flush();
	}

	/**
	 * @Method: addToHashSet
	 * @Description: 把值存入到给定缓存给定键的一个set中
	 * @modifyBy:刘希望
	 * @modifyDate:2013-8-22
	 * @param cache
	 * @param key
	 * @param value
	 * @throws
	 */
	public void addToHashSet(Cache cache, String key, Serializable value) {
		if (cache == null) {
			throw new CacheException("cache不存在");
		}
		Element e = cache.get(key);
		if (isNull(e)) {
			Set<Serializable> list = Collections
					.synchronizedSet(new HashSet<Serializable>());
			list.add(value);
			e = new Element(key, list);
			e.setEternal(true);
			cache.put(e);
		} else {
			Set<Serializable> list = (Set<Serializable>) e.getObjectValue();
			list.add(value);
			e = new Element(key, list);
			e.setEternal(true);
			cache.put(e);
		}

		cache.flush();
	}

	/**
	 * @Method: addAllToHashSet
	 * @Description: 把一组值存入到给定缓存给定键的一个set中
	 * @modifyBy:刘希望
	 * @modifyDate:2013-8-22
	 * @param cache
	 * @param key
	 * @param value
	 * @throws
	 */
	public void addAllToHashSet(Cache cache, String key,
			Collection<? extends Serializable> value) {
		if (cache == null) {
			throw new CacheException("cache不存在");
		}
		Element e = cache.get(key);
		if (isNull(e)) {
			Set<Serializable> list = Collections
					.synchronizedSet(new HashSet<Serializable>());
			list.addAll(value);
			e = new Element(key, list);
			e.setEternal(true);
			cache.put(e);
		} else {
			Set<Serializable> list = (Set<Serializable>) e.getObjectValue();
			list.addAll(value);
			e = new Element(key, list);
			e.setEternal(true);
			cache.put(e);
		}

		cache.flush();
	}

	public void addToArrayList(Cache cache, String key, Serializable value) {
		if (cache == null) {
			throw new CacheException("cache不存在");
		}
		Element e = cache.get(key);
		if (isNull(e)) {
			List<Serializable> list = Collections
					.synchronizedList(new ArrayList<Serializable>());
			list.add(value);
			e = new Element(key, list);
			e.setEternal(true);
			cache.put(e);
		} else {
			List<Serializable> list = (List<Serializable>) e.getObjectValue();
			list.add(value);
			e = new Element(key, list);
			e.setEternal(true);
			cache.put(e);
		}

		cache.flush();
	}

	public void addAllToArrayList(Cache cache, String key,
			Collection<? extends Serializable> value) {
		if (cache == null) {
			throw new CacheException("cache不存在");
		}
		Element e = cache.get(key);
		if (isNull(e)) {
			List<Serializable> list = Collections
					.synchronizedList(new ArrayList<Serializable>());
			list.addAll(value);
			e = new Element(key, list);
			e.setEternal(true);
			cache.put(e);
		} else {
			List<Serializable> list = (List<Serializable>) e.getObjectValue();
			list.addAll(value);
			e = new Element(key, list);
			e.setEternal(true);
			cache.put(e);
		}

		cache.flush();
	}

	public <T extends Serializable> T popFromList(Cache cache, String key,
			Class<T> T) {
		if (cache == null) {
			throw new CacheException("cache不存在");
		}
		Element e = cache.get(key);
		if (e != null) {
			List<Serializable> list = (List<Serializable>) e.getObjectValue();
			Iterator<Serializable> it = list.iterator();
			if (list.size() > 0) {
				Serializable obj = it.next();
				it.remove();
				e = new Element(key, list);
				e.setEternal(true);
				cache.put(e);
				cache.flush();
				return (T) obj;
			}
		}
		return null;
	}

	public <T extends Serializable> List<T> popFromList(Cache cache,
			String key, int count, Class<T> T) {
		if (cache == null) {
			throw new CacheException("cache不存在");
		}
		Element e = cache.get(key);
		if (e != null) {
			List<Serializable> list = (List<Serializable>) e.getObjectValue();

			if (count < 1) {
				List<T> result = (List<T>) new ArrayList<Serializable>(list);
				list.clear();
				e = new Element(key, list);
				e.setEternal(true);
				cache.put(e);
				cache.flush();
				return result;
			}

			List<T> result = new ArrayList<T>(count);
			Iterator<Serializable> it = list.iterator();
			for (int i = 0; i < count && it.hasNext(); i++) {
				Serializable obj = it.next();
				it.remove();
				result.add((T) obj);
			}

			e = new Element(key, list);
			e.setEternal(true);
			cache.put(e);
			cache.flush();
			return result;
		}
		return null;
	}

	public <T extends Serializable> T popFromHashSet(Cache cache, String key,
			Class<T> T) {
		if (cache == null) {
			throw new CacheException("cache不存在");
		}
		Element e = cache.get(key);
		if (e != null) {
			Set<Serializable> list = (Set<Serializable>) e.getObjectValue();
			Iterator<Serializable> it = list.iterator();
			if (list.size() > 0) {
				Serializable obj = it.next();
				it.remove();
				e = new Element(key, list);
				e.setEternal(true);
				cache.put(e);
				cache.flush();
				return (T) obj;
			}
		}
		return null;
	}

	public <T extends Serializable> List<T> popFromHashSet(Cache cache,
			String key, int count, Class<T> T) {
		if (cache == null) {
			throw new CacheException("cache不存在");
		}
		Element e = cache.get(key);
		if (e != null) {
			Set<Serializable> list = (Set<Serializable>) e.getObjectValue();

			if (count < 1) {
				List<T> result = (List<T>) new ArrayList<Serializable>(list);
				list.clear();
				e = new Element(key, list);
				e.setEternal(true);
				cache.put(e);
				cache.flush();
				return result;
			}

			List<T> result = new ArrayList<T>(count);
			Iterator<Serializable> it = list.iterator();
			for (int i = 0; i < count && it.hasNext(); i++) {
				Serializable obj = it.next();
				it.remove();
				result.add((T) obj);
			}

			e = new Element(key, list);
			e.setEternal(true);
			cache.put(e);
			cache.flush();
			return result;
		}
		return null;
	}

	public int getCollectionSize(Cache cache, String key) {
		if (cache == null) {
			throw new CacheException("cache不存在");
		}
		Element e = cache.get(key);
		if (e != null) {
			Collection<Serializable> list = (Collection<Serializable>) e
					.getObjectValue();
			return list.size();
		}
		return 0;
	}

	@SuppressWarnings("rawtypes")
	public List getKeys(Cache cache) {
		if (cache == null) {
			throw new CacheException("cache不存在");
		}
		return cache.getKeys();
	}

	public List<String> getKeys(Cache cache, String start) {
		if (cache == null) {
			throw new CacheException("cache不存在");
		}
		List<?> list = cache.getKeys();
		List<String> result = new ArrayList<String>(list.size());
		for (Object obj : list) {
			if (obj != null && obj.getClass() == String.class) {
				String s = (String) obj;
				if (s.startsWith(start))
					result.add(s);
			}
		}
		return result;
	}

	public CacheManager getCacheManager() {
		return manager;
	}
}