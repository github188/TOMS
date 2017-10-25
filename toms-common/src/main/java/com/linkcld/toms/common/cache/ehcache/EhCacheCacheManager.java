package com.linkcld.toms.common.cache.ehcache;

import com.linkcld.toms.common.cache.ICache;
import com.linkcld.toms.common.cache.ICacheManager;
import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheManager;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

public class EhCacheCacheManager implements ICacheManager {
	private CacheManager manager = null;
	private ConcurrentMap<String, ICache> caches = null;

	private static EhCacheCacheManager instance = null;

	public static EhCacheCacheManager getInstance() {
		if (instance == null) {
			synchronized (EhCacheCacheManager.class) {
				if (instance == null) {
					instance = new EhCacheCacheManager();
				}
			}
		}

		return instance;
	}

	private EhCacheCacheManager() {
		super();
		this.manager = CacheManager.getInstance();
		caches = new ConcurrentHashMap<String, ICache>();
	}

	public List<ICache> getAllCaches() {
		return new ArrayList<ICache>(caches.values());
	}

	public ICache getCache(String cacheName) {
		ICache cache = caches.get(cacheName);
		if (cache == null) {
			Cache ehCache = manager.getCache(cacheName);
			if (ehCache == null) {
				manager.addCacheIfAbsent(cacheName);
				ehCache = manager.getCache(cacheName);
			}
			cache = (ICache) new EhCacheCache(ehCache);
		}
		return cache;
	}

	public static void main(String[] args) {
		ICacheManager cacheManager = EhCacheCacheManager.getInstance();
		ICache cache = cacheManager.getCache("test");
		cache.put("a", "a");
		System.out.println(cache.get("a"));
		System.out.println(cache.get("b"));
		cacheManager.shutdown();
	}

	public void shutdown() {
		manager.shutdown();
	}
}